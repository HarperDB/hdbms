import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { useHistory, useParams } from 'react-router';
import { useAlert } from 'react-alert';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';
import useAsyncEffect from 'use-async-effect';
import { ErrorBoundary } from 'react-error-boundary';

import config from '../../../config';
import appState from '../../../state/appState';
import useInstanceAuth from '../../../state/instanceAuths';

import handleInstanceRegistration from '../../../methods/instances/handleInstanceRegistration';
import userInfo from '../../../api/instance/userInfo';
import CardFrontStatusRow from '../../shared/cardFrontStatusRow';
import CardFrontIcons from './cardFrontIcons';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../api/lms/addError';

const modifyingStatus = ['CREATING INSTANCE', 'DELETING INSTANCE', 'UPDATING INSTANCE', 'LOADING', 'CONFIGURING NETWORK', 'APPLYING LICENSE'];
const clickableStatus = ['OK', 'PLEASE LOG IN', 'LOGIN FAILED'];

const CardFront = ({ compute_stack_id, instance_id, url, status, instance_region, instance_name, is_local, setFlipState, flipState, compute, storage }) => {
  const { customer_id } = useParams();
  const auth = useStoreState(appState, (s) => s.auth);
  const isOrgOwner = auth?.orgs?.find((o) => o.customer_id?.toString() === customer_id)?.status === 'owner';
  const history = useHistory();
  const alert = useAlert();
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});
  const instanceAuth = useMemo(() => instanceAuths && instanceAuths[compute_stack_id], [instanceAuths, compute_stack_id]);
  const [instanceData, setInstanceData] = useState({ status: 'LOADING', clustering: '', version: '' });
  const [lastUpdate, setLastUpdate] = useState(false);
  const [processing, setProcessing] = useState(false);
  const isReady = useMemo(() => !modifyingStatus.includes(instanceData.status), [instanceData.status]);

  const handleCardClick = useCallback(async () => {
    if (!instanceAuth) {
      setFlipState('login');
    } else if (instanceData.status === 'OK') {
      const result = await userInfo({ auth: instanceAuth, url, is_local, compute_stack_id, customer_id });

      if (result.error) {
        setInstanceData({ ...instanceData, status: 'UNABLE TO CONNECT', error: true, retry: true });
        alert.error(result.message);
      } else {
        history.push(`/o/${customer_id}/i/${compute_stack_id}/browse`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instanceAuth, instanceData.status]);

  useAsyncEffect(async () => {
    if (processing) return false;

    if (['CREATE_IN_PROGRESS', 'UPDATE_IN_PROGRESS', 'CONFIGURING_NETWORK', 'CREATE_FAILED'].includes(status)) {
      return setInstanceData({
        ...instanceData,
        status:
          status === 'CREATE_IN_PROGRESS'
            ? 'CREATING INSTANCE'
            : status === 'UPDATE_IN_PROGRESS'
            ? 'UPDATING INSTANCE'
            : status === 'CREATE_FAILED'
            ? 'CREATE FAILED'
            : 'CONFIGURING NETWORK',
        error: status === 'CREATE_FAILED',
        retry: status === 'CONFIGURING_NETWORK',
      });
    }

    if (!instanceAuth) {
      return setInstanceData({ ...instanceData, status: 'PLEASE LOG IN', error: true, retry: false });
    }

    if (!instanceAuth.super) {
      return setInstanceData({ ...instanceData, status: 'OK', error: false, retry: false });
    }

    if (instanceData.status === 'APPLYING LICENSE') {
      const restartResult = await userInfo({ auth: instanceAuth, url, is_local, compute_stack_id, customer_id });
      if (!restartResult.error) {
        setInstanceData({ ...instanceData, status: 'OK', error: false, retry: false });
      }
      return false;
    }

    setProcessing(true);

    const registrationResult = await handleInstanceRegistration({
      auth,
      customer_id,
      instanceAuth,
      url,
      is_local,
      instance_id,
      compute_stack_id,
      compute,
      instance_name,
      status: instanceData.status,
    });

    setProcessing(false);

    if (['UNABLE TO CONNECT', 'LOGIN FAILED'].includes(registrationResult.instance) && ['APPLYING LICENSE', 'CONFIGURING NETWORK'].includes(instanceData.status)) {
      return false;
    }

    if (['PLEASE LOG IN', 'LOGIN FAILED'].includes(registrationResult.instance)) {
      if (instanceAuth) {
        setInstanceAuths({ ...instanceAuths, [compute_stack_id]: false });
      }
      if (['PLEASE LOG IN', 'LOGIN FAILED', 'UNABLE TO CONNECT'].includes(instanceData.status)) {
        registrationResult.instance = 'LOGIN FAILED';
      }
    }
    return setInstanceData({ ...instanceData, ...registrationResult });
  }, [status, instanceAuth?.user, instanceAuth?.pass, lastUpdate]);

  useInterval(() => {
    if (instanceData.retry) setLastUpdate(Date.now());
  }, config.refresh_content_interval);

  return (
    <ErrorBoundary
      onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
      FallbackComponent={ErrorFallback}
    >
      <Card
        tabIndex="0"
        title={`${instanceAuth ? 'Connect to' : 'Log into'} instance ${instance_name}`}
        className={`instance ${clickableStatus.includes(instanceData.status) ? '' : 'unclickable'}`}
        onKeyDown={(e) => e.keyCode !== 13 || handleCardClick(e)}
        onClick={handleCardClick}
      >
        {!flipState && (
          <CardBody>
            <Row>
              <Col xs="10" className="instance-name">
                {instance_name}
              </Col>
              <Col xs="2" className="instance-icons">
                <CardFrontIcons
                  isOrgOwner={isOrgOwner}
                  isReady={isReady}
                  showLogout={instanceAuth}
                  setFlipState={setFlipState}
                  compute_stack_id={compute_stack_id}
                  instance_name={instance_name}
                  onlyDelete={instanceData.status === 'CREATE FAILED'}
                />
              </Col>
            </Row>
            <div className="instance-url">{url}</div>
            <CardFrontStatusRow
              label="STATUS"
              isReady
              textClass={`text-bold text-${instanceData.error ? 'danger' : 'success'}`}
              value={instanceData.status?.toUpperCase()}
              bottomDivider
            />
            <CardFrontStatusRow label="REGION" isReady={isReady} value={is_local ? 'USER INSTALLED' : instance_region.toUpperCase()} bottomDivider />
            <CardFrontStatusRow
              label="LICENSE"
              isReady={isReady}
              value={`${compute?.compute_ram_string || '...'} RAM / ${storage?.data_volume_size_string || 'DEVICE'} DISK`}
              bottomDivider
            />
            <CardFrontStatusRow label="VERSION" isReady={isReady} value={instanceData.version} bottomDivider />
            <CardFrontStatusRow label="CLUSTERING" isReady={isReady} value={instanceData.clustering.toUpperCase()} />
          </CardBody>
        )}
      </Card>
    </ErrorBoundary>
  );
};

export default CardFront;
