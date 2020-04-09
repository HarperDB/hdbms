import React, { useState } from 'react';
import { Card, CardBody, Col, Row } from '@nio/ui-kit';
import { useHistory } from 'react-router';
import { useAlert } from 'react-alert';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';
import useAsyncEffect from 'use-async-effect';

import config from '../../../../config';
import appState from '../../../state/stores/appState';
import useInstanceAuth from '../../../state/stores/instanceAuths';

import handleInstanceRegistration from '../../../util/instance/handleInstanceRegistration';
import registrationInfo from '../../../api/instance/registrationInfo';

const showSpinnerStatus = ['CREATING INSTANCE', 'UPDATING INSTANCE', 'DELETING INSTANCE', 'LOADING', 'CONFIGURING NETWORK', 'APPLYING LICENSE'];
const modifyingStatus = ['CREATING INSTANCE', 'DELETING INSTANCE', 'UPDATING INSTANCE'];
const refreshInstanceStatus = ['ERROR CREATING LICENSE', 'APPLYING LICENSE', 'CONFIGURING NETWORK', 'UNABLE TO CONNECT'];
const clickableStatus = ['OK', 'PLEASE LOG IN', 'LOGIN FAILED'];

export default ({ compute_stack_id, instance_id, url, status, instance_region, instance_name, is_local, showLogin, showDelete, compute, storage }) => {
  const auth = useStoreState(appState, (s) => s.auth);
  const history = useHistory();
  const alert = useAlert();
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});
  const instanceAuth = instanceAuths && instanceAuths[compute_stack_id];
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

  const handleCardClick = async () => {
    if (!instanceAuth) {
      return showLogin();
    }
    if (instanceStatus.instance !== 'OK') {
      return false;
    }
    const result = await registrationInfo({ auth: instanceAuth, url });
    if (result.error) {
      setInstanceStatus({
        ...instanceStatus,
        instance: 'UNABLE TO CONNECT',
        instanceError: true,
      });
      return alert.error('Unable to connect to instance.');
    }
    return history.push(`/instance/${compute_stack_id}/browse`);
  };

  const processInstanceCard = async () => {
    if (['CREATE_IN_PROGRESS', 'UPDATE_IN_PROGRESS'].includes(status)) {
      return false;
    }

    if (status === 'WAITING ON APIGATEWAY') {
      setInstanceStatus({
        ...instanceStatus,
        instance: 'CONFIGURING NETWORK',
      });
      return false;
    }

    if (['DELETE_IN_PROGRESS', 'QUEUED_FOR_DELETE'].includes(status)) {
      setInstanceStatus({
        ...instanceStatus,
        instance: 'DELETING INSTANCE',
        instanceError: true,
      });
      return false;
    }

    if (instanceStatus.instance === 'APPLYING LICENSE') {
      const restartResult = await registrationInfo({ auth: instanceAuth, url });
      if (!restartResult.error) {
        setInstanceStatus({
          ...instanceStatus,
          instance: 'OK',
          version: restartResult.version,
        });
      }
      return false;
    }

    const registrationResult = await handleInstanceRegistration({
      auth,
      instanceAuth,
      url,
      is_local,
      instance_id,
      compute_stack_id,
      compute,
    });

    if (
      ['COULD NOT CONNECT', 'UNABLE TO CONNECT', 'LOGIN FAILED'].includes(registrationResult.instance) &&
      ['APPLYING LICENSE', 'CONFIGURING NETWORK'].includes(instanceStatus.instance)
    ) {
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
  };

  useAsyncEffect(() => processInstanceCard(), [status, instanceAuth?.user, instanceAuth?.pass, lastUpdate]);

  useInterval(() => {
    if (refreshInstanceStatus.includes(instanceStatus.instance)) setLastUpdate(Date.now());
  }, config.instance_refresh_rate);

  return (
    <Card className={`instance ${clickableStatus.includes(instanceStatus.instance) ? '' : 'unclickable'}`} onClick={handleCardClick}>
      <CardBody>
        <Row>
          <Col xs="10" className="instance-name">
            {instance_name}
          </Col>
          <Col xs="2" className="instance-icon">
            {!modifyingStatus.includes(instanceStatus.instance) && (
              <i
                title="Remove Instance"
                className="fa fa-trash rm-1 delete text-purple"
                onClick={(e) => {
                  e.stopPropagation();
                  showDelete();
                }}
              />
            )}
            {showSpinnerStatus.includes(instanceStatus.instance) ? (
              <i title={instanceStatus.instance} className="fa fa-spinner fa-spin text-purple" />
            ) : instanceStatus.instance === 'COULD NOT CONNECT' ? (
              <i title={instanceStatus.instance} className="fa fa-exclamation-triangle text-danger" />
            ) : instanceAuth ? (
              <i
                onClick={(e) => {
                  e.stopPropagation();
                  setInstanceAuths({
                    ...instanceAuths,
                    [compute_stack_id]: false,
                  });
                }}
                title="Remove Instance Authentication"
                className="fa fa-lock text-purple"
              />
            ) : (
              <i title="Instance Requires Authentication" className="fa fa-unlock-alt text-danger" />
            )}
          </Col>
        </Row>
        <div className="instance-url">{clickableStatus.includes(instanceStatus.instance) ? url : ''}</div>
        <Row className="text-smaller text-nowrap text-darkgrey">
          <Col xs="4">STATUS</Col>
          <Col xs="8" className={`text-bold text-${instanceStatus.instanceError ? 'danger' : 'success'}`}>
            {instanceStatus.instance?.toUpperCase()}
          </Col>
          <Col xs="12">
            <hr className="my-1" />
          </Col>
          <Col xs="4">VERSION</Col>
          <Col xs="8">{modifyingStatus.includes(instanceStatus.instance) ? '' : instanceStatus.version}</Col>
          <Col xs="12">
            <hr className="my-1" />
          </Col>
          <Col xs="4">REGION</Col>
          <Col xs="8">{modifyingStatus.includes(instanceStatus.instance) ? '' : is_local ? 'USER INSTALLED' : instance_region.toUpperCase()}</Col>
          <Col xs="12">
            <hr className="my-1" />
          </Col>
          <Col xs="4">LICENSE</Col>
          <Col xs="8">{!modifyingStatus.includes(instanceStatus.instance) && `${compute?.ram} RAM / ${storage?.disk_space || 'DEVICE'} DISK`}</Col>
          <Col xs="12">
            <hr className="my-1" />
          </Col>
          <Col xs="4">CLUSTERING</Col>
          <Col xs="8">{modifyingStatus.includes(instanceStatus.instance) ? '' : instanceStatus.clustering.toUpperCase()}</Col>
        </Row>
      </CardBody>
    </Card>
  );
};
