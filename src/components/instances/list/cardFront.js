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

export default ({ compute_stack_id, instance_id, url, status, instance_name, is_local, flipCard, compute, storage, license }) => {
  const auth = useStoreState(appState, (s) => s.auth);
  const history = useHistory();
  const alert = useAlert();
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});
  const instanceAuth = instanceAuths && instanceAuths[compute_stack_id];
  const [instanceStatus, setInstanceStatus] = useState({ instance: status === 'CREATE_IN_PROGRESS' ? 'CREATING INSTANCE' : 'LOADING', instanceError: false, clustering: '' });
  const [lastUpdate, setLastUpdate] = useState(false);

  const handleCardClick = async () => {
    if (!instanceAuth) return flipCard();
    if (!is_local && status !== 'CREATE_COMPLETE') return false;
    const result = await registrationInfo({ auth: instanceAuth, url });
    if (result.error) {
      setInstanceStatus({ ...instanceStatus, instance: 'UNABLE TO CONNECT', instanceError: true });
      return alert.error('Unable to connect to instance.');
    }
    return history.push(`/instance/${compute_stack_id}/browse`);
  };

  const processInstanceCard = async () => {
    if (status === 'CREATE_IN_PROGRESS') {
      return false;
    }

    if (status === 'WAITING ON APIGATEWAY') {
      setInstanceStatus({ ...instanceStatus, instance: 'CONFIGURING NETWORK' });
      return false;
    }

    if (status === 'DELETE_IN_PROGRESS') {
      setInstanceStatus({ ...instanceStatus, instance: 'DELETING INSTANCE', instanceError: true });
      return false;
    }

    if (instanceStatus.instance === 'APPLYING LICENSE') {
      const restartResult = await registrationInfo({ auth: instanceAuth, url });
      if (!restartResult.error) {
        setInstanceStatus({ ...instanceStatus, instance: 'OK' });
      }
      return false;
    }

    const registrationResult = await handleInstanceRegistration({ auth, instanceAuth, url, is_local, instance_id, license, compute_stack_id });

    if (['COULD NOT CONNECT', 'UNABLE TO CONNECT', 'LOGIN FAILED'].includes(registrationResult.instance) && ['APPLYING LICENSE', 'CONFIGURING NETWORK'].includes(instanceStatus.instance)) {
      return false;
    }

    if (['PLEASE LOG IN', 'LOGIN FAILED'].includes(registrationResult.instance)) {
      if (instanceAuth) {
        setInstanceAuths({ ...instanceAuths, [compute_stack_id]: false });
      }
      if (['PLEASE LOG IN', 'LOGIN FAILED', 'UNABLE TO CONNECT'].includes(instanceStatus.instance)) {
        registrationResult.instance = 'LOGIN FAILED';
      }
    }

    return setInstanceStatus({ ...instanceStatus, ...registrationResult });
  };

  useAsyncEffect(() => processInstanceCard(), [status, license, instanceAuth.user, instanceAuth.pass, lastUpdate]);

  useInterval(() => { if (['ERROR CREATING LICENSE', 'APPLYING LICENSE', 'CONFIGURING NETWORK', 'UNABLE TO CONNECT'].includes(instanceStatus.instance)) setLastUpdate(Date.now()); }, config.instance_refresh_rate);

  return (
    <Card className="instance" onClick={() => handleCardClick({ instanceAuth, flipCard, instanceStatus, url, setInstanceStatus, history, compute_stack_id, alert })}>
      <CardBody>
        <Row>
          <Col xs="10" className="instance-name">{instance_name}</Col>
          <Col xs="2" className="instance-icon">
            {['CREATING INSTANCE', 'DELETING INSTANCE', 'LOADING', 'CONFIGURING NETWORK', 'APPLYING LICENSE'].includes(instanceStatus.instance) ? (
              <i title={instanceStatus.instance} className="fa fa-spinner fa-spin text-purple" />
            ) : instanceStatus.instance === 'COULD NOT CONNECT' ? (
              <i title={instanceStatus.instance} className="fa fa-exclamation-triangle text-danger" />
            ) : instanceAuths[compute_stack_id] ? (
              <i onClick={(e) => { e.stopPropagation(); setInstanceAuths({ ...instanceAuths, [compute_stack_id]: false }); }} title="Remove Instance Authentication" className="fa fa-lock text-purple" />
            ) : (
              <i title="Instance Requires Authentication" className="fa fa-unlock-alt text-danger" />
            )}
          </Col>
        </Row>
        <div className="instance-url">{['PLEASE LOG IN', 'LOGIN FAILED', 'OK'].includes(instanceStatus.instance) ? url : ''}</div>
        <Row className="text-smaller text-nowrap text-darkgrey">
          <Col xs="3">STATUS</Col>
          <Col xs="9" className={`text-bold text-${instanceStatus.instanceError ? 'danger' : 'success'}`}>{instanceStatus.instance?.replace(/_/g, ' ').toUpperCase()}</Col>
          <Col xs="12"><hr className="my-1" /></Col>
          <Col xs="3">TYPE</Col>
          <Col xs="9">{is_local ? 'USER INSTALLED' : 'HARPERDB CLOUD'}</Col>
          <Col xs="12"><hr className="my-1" /></Col>
          <Col xs="3">RAM</Col>
          <Col xs="9">{compute?.ram}</Col>
          <Col xs="12"><hr className="my-1" /></Col>
          <Col xs="3">STORAGE</Col>
          <Col xs="9">{storage?.disk_space || 'NO LIMIT'}</Col>
          <Col xs="12"><hr className="my-1" /></Col>
          <Col xs="3">CLUSTERING</Col>
          <Col xs="9">{instanceStatus.clustering.toUpperCase()}</Col>
        </Row>
      </CardBody>
    </Card>
  );
};
