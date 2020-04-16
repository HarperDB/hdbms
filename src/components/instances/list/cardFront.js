import React, { useState, useMemo } from 'react';
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

const modifyingStatus = ['CREATING INSTANCE', 'DELETING INSTANCE', 'UPDATING INSTANCE', 'LOADING', 'CONFIGURING NETWORK', 'APPLYING LICENSE'];
const refreshInstanceStatus = ['APPLYING LICENSE', 'CONFIGURING NETWORK', 'UNABLE TO CONNECT'];
const clickableStatus = ['OK', 'PLEASE LOG IN', 'LOGIN FAILED'];

const CardFront = ({ compute_stack_id, instance_id, url, status, instance_region, instance_name, is_local, setFlipState, flipState, compute, storage }) => {
  const auth = useStoreState(appState, (s) => s.auth);
  const history = useHistory();
  const alert = useAlert();
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});
  const instanceAuth = useMemo(() => instanceAuths && instanceAuths[compute_stack_id], [instanceAuths, compute_stack_id]);
  const [instanceStatus, setInstanceStatus] = useState({
    instance: status === 'CREATE_IN_PROGRESS' ? 'CREATING INSTANCE' : status === 'UPDATE_IN_PROGRESS' ? 'UPDATING INSTANCE' : 'LOADING',
    instanceError: false,
    clustering: '',
    version: '',
  });
  const [lastUpdate, setLastUpdate] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [clicked, handleCardClick] = useState(false);
  const isReady = useMemo(() => !modifyingStatus.includes(instanceStatus.instance), [instanceStatus.instance]);

  useAsyncEffect(async () => {
    if (clicked) {
      handleCardClick(false);
      if (!instanceAuth) {
        setFlipState('login');
      } else if (instanceStatus.instance === 'OK') {
        const result = await userInfo({ auth: instanceAuth, url });
        if (result.error) {
          setInstanceStatus({
            ...instanceStatus,
            instance: 'UNABLE TO CONNECT',
            instanceError: true,
          });
          alert.error('Unable to connect to instance.');
        } else {
          history.push(`/instance/${compute_stack_id}/browse`);
        }
      }
    }
  }, [clicked]);

  useAsyncEffect(async () => {
    if (processing || ['CREATE_IN_PROGRESS', 'UPDATE_IN_PROGRESS'].includes(status)) {
      return false;
    }

    if (!instanceAuth) {
      return setInstanceStatus({
        ...instanceStatus,
        instance: 'PLEASE LOG IN',
        instanceError: true,
      });
    }

    if (['CREATING INSTANCE', 'CONFIGURING NETWORK'].includes(instanceStatus.instance) && status === 'CREATE_COMPLETE') {
      const connectionResult = await userInfo({ auth: instanceAuth, url });
      if (connectionResult.error) {
        setInstanceStatus({
          ...instanceStatus,
          instance: 'CONFIGURING NETWORK',
        });
        return false;
      }
    }

    if (instanceStatus.instance === 'APPLYING LICENSE') {
      const restartResult = await userInfo({ auth: instanceAuth, url });
      if (!restartResult.error) {
        setInstanceStatus({
          ...instanceStatus,
          instance: 'OK',
        });
      }
      return false;
    }

    setProcessing(true);

    const registrationResult = await handleInstanceRegistration({
      auth,
      instanceAuth,
      url,
      is_local,
      instance_id,
      compute_stack_id,
      compute,
      instance_name,
    });

    setProcessing(false);

    if (['UNABLE TO CONNECT', 'LOGIN FAILED'].includes(registrationResult.instance) && ['APPLYING LICENSE', 'CONFIGURING NETWORK'].includes(instanceStatus.instance)) {
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

    return setInstanceStatus({ ...instanceStatus, ...registrationResult });
  }, [status, instanceAuth?.user, instanceAuth?.pass, lastUpdate]);

  useInterval(() => {
    if (refreshInstanceStatus.includes(instanceStatus.instance)) setLastUpdate(Date.now());
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
              <CardFrontIcons isReady={isReady} showLogout={instanceAuth} setFlipState={setFlipState} compute_stack_id={compute_stack_id} />
            </Col>
          </Row>
          <div className="instance-url">{url}</div>
          <CardFrontStatusRow
            label="STATUS"
            isReady
            textClass={`text-bold text-${instanceStatus.instanceError ? 'danger' : 'success'}`}
            value={instanceStatus.instance?.toUpperCase()}
            bottomDivider
          />
          <CardFrontStatusRow label="REGION" isReady={isReady} value={is_local ? 'USER INSTALLED' : instance_region.toUpperCase()} bottomDivider />
          <CardFrontStatusRow label="LICENSE" isReady={isReady} value={`${compute?.ram} RAM / ${storage?.disk_space || 'DEVICE'} DISK`} bottomDivider />
          <CardFrontStatusRow label="VERSION" isReady={isReady} value={instanceStatus.version} bottomDivider />
          <CardFrontStatusRow label="CLUSTERING" isReady={isReady} value={instanceStatus.clustering.toUpperCase()} />
        </CardBody>
      )}
    </Card>
  );
};

export default CardFront;
