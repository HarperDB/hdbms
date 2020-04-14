import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardBody, Col, Row } from '@nio/ui-kit';
import { useHistory } from 'react-router';
import { useAlert } from 'react-alert';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';
import useAsyncEffect from 'use-async-effect';

import config from '../../../../config';
import appState from '../../../state/appState';
import useInstanceAuth from '../../../state/instanceAuths';

import handleInstanceRegistration from '../../../methods/instances/handleInstanceRegistration';
import userInfo from '../../../api/instance/userInfo';

import CardFrontStatusRow from './cardFrontStatusRow';
import CardFrontIcons from './cardFrontIcons';

const showSpinnerStatus = ['CREATING INSTANCE', 'UPDATING INSTANCE', 'DELETING INSTANCE', 'LOADING', 'APPLYING LICENSE'];
const modifyingStatus = ['CREATING INSTANCE', 'DELETING INSTANCE', 'UPDATING INSTANCE'];
const refreshInstanceStatus = ['ERROR CREATING LICENSE', 'APPLYING LICENSE', 'UNABLE TO CONNECT'];
const clickableStatus = ['OK', 'PLEASE LOG IN', 'LOGIN FAILED'];

const CardFront = ({ compute_stack_id, instance_id, url, status, instance_region, instance_name, is_local, setFlipState, flipState, compute, storage }) => {
  const auth = useStoreState(appState, (s) => s.auth);
  const history = useHistory();
  const alert = useAlert();
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});
  const instanceAuth = useMemo(() => instanceAuths && instanceAuths[compute_stack_id], [instanceAuths, compute_stack_id]);
  const [instanceStatus, setInstanceStatus] = useState({
    instance:
      status === 'CREATE_IN_PROGRESS'
        ? 'CREATING INSTANCE'
        : status === 'UPDATE_IN_PROGRESS'
        ? 'UPDATING INSTANCE'
        : ['DELETE_IN_PROGRESS', 'QUEUED_FOR_DELETE'].includes(status)
        ? 'DELETING INSTANCE'
        : 'LOADING',
    instanceError: false,
    clustering: '',
    version: '',
  });
  const [lastUpdate, setLastUpdate] = useState(false);
  const [processing, setProccessing] = useState(false);
  const showInstanceInfoRows = !modifyingStatus.includes(instanceStatus.instance);

  const handleCardClick = useCallback(async () => {
    if (!instanceAuth) {
      return setFlipState('login');
    }
    if (instanceStatus.instance !== 'OK') {
      return false;
    }
    const result = await userInfo({ auth: instanceAuth, url });
    if (result.error) {
      setInstanceStatus({
        ...instanceStatus,
        instance: 'UNABLE TO CONNECT',
        instanceError: true,
      });
      return alert.error('Unable to connect to instance.');
    }
    return history.push(`/instance/${compute_stack_id}/browse`);
  }, [instanceAuth, instanceStatus.instance]);

  const processInstanceCard = useCallback(async () => {
    setProccessing(true);

    const registrationResult = await handleInstanceRegistration({
      auth,
      instanceAuth,
      url,
      is_local,
      instance_id,
      compute_stack_id,
      compute,
      modifyingStatus,
      instanceStatus,
      setInstanceStatus,
    });

    setProccessing(false);

    if (['COULD NOT CONNECT', 'UNABLE TO CONNECT', 'LOGIN FAILED'].includes(registrationResult.instance) && ['APPLYING LICENSE'].includes(instanceStatus.instance)) {
      return false;
    }

    if (['PLEASE LOG IN', 'LOGIN FAILED'].includes(registrationResult.instance)) {
      if (instanceAuth) {
        setInstanceAuths({
          ...instanceAuths,
          [compute_stack_id]: false,
        });
      }
      if (['PLEASE LOG IN', 'LOGIN FAILED', 'UNABLE TO CONNECT'].includes(instanceStatus.instance)) {
        registrationResult.instance = 'LOGIN FAILED';
      }
    }

    return setInstanceStatus({
      ...instanceStatus,
      ...registrationResult,
    });
  }, [instanceAuth, instanceStatus.instance]);

  useAsyncEffect(() => {
    if (!processing && !flipState && !modifyingStatus.includes(instanceStatus.instance)) {
      processInstanceCard();
    }
  }, [status, instanceAuth?.user, instanceAuth?.pass, lastUpdate]);

  useInterval(() => {
    if (refreshInstanceStatus.includes(instanceStatus.instance)) {
      setLastUpdate(Date.now());
    }
  }, config.instance_refresh_rate);

  return (
    <Card className={`instance ${clickableStatus.includes(instanceStatus.instance) ? '' : 'unclickable'}`} onClick={handleCardClick}>
      {!flipState && (
        <CardBody>
          <Row>
            <Col xs="10" className="instance-name">
              {instance_name}
            </Col>
            <Col xs="2" className="instance-icon">
              <CardFrontIcons
                showRemove={!modifyingStatus.includes(instanceStatus.instance)}
                showSpinner={showSpinnerStatus.includes(instanceStatus.instance)}
                showError={instanceStatus.instance === 'COULD NOT CONNECT'}
                showLogout={instanceAuth}
                setFlipState={setFlipState}
                compute_stack_id={compute_stack_id}
              />
            </Col>
          </Row>
          <div className="instance-url">{clickableStatus.includes(instanceStatus.instance) ? url : ''}</div>
          <CardFrontStatusRow
            label="STATUS"
            showInstanceInfoRows
            textClass={`text-bold text-${instanceStatus.instanceError ? 'danger' : 'success'}`}
            value={instanceStatus.instance?.toUpperCase()}
            bottomDivider
          />
          <CardFrontStatusRow label="VERSION" showInstanceInfoRows={showInstanceInfoRows} value={instanceStatus.version} bottomDivider />
          <CardFrontStatusRow label="REGION" showInstanceInfoRows={showInstanceInfoRows} value={is_local ? 'USER INSTALLED' : instance_region.toUpperCase()} bottomDivider />
          <CardFrontStatusRow label="LICENSE" showInstanceInfoRows={showInstanceInfoRows} value={`${compute?.ram} RAM / ${storage?.disk_space || 'DEVICE'} DISK`} bottomDivider />
          <CardFrontStatusRow label="CLUSTERING" showInstanceInfoRows={showInstanceInfoRows} value={instanceStatus.clustering.toUpperCase()} />
        </CardBody>
      )}
    </Card>
  );
};

export default CardFront;
