import React, { useState } from 'react';
import { Card, CardBody, Col, Row } from '@nio/ui-kit';
import { useHistory } from 'react-router';
import { useAlert } from 'react-alert';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';
import useAsyncEffect from 'use-async-effect';

import appState from '../../../state/stores/appState';
import useInstanceAuth from '../../../state/stores/instanceAuths';

import handleInstanceRegistration from '../../../util/instance/handleInstanceRegistration';
import registrationInfo from '../../../api/instance/registrationInfo';

export default ({ compute_stack_id, instance_id, url, status, instance_name, is_local, flipCard, compute, storage, license, stripe_product_id }) => {
  const auth = useStoreState(appState, (s) => s.auth);
  const history = useHistory();
  const alert = useAlert();
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});
  const instanceAuth = instanceAuths && instanceAuths[compute_stack_id];
  const [instanceStatus, setInstanceStatus] = useState({ instance: status === 'CREATE_IN_PROGRESS' ? 'CREATING INSTANCE' : 'LOADING', instanceError: false, license: '', licenseError: false, clustering: '' });
  const [lastUpdate, setLastUpdate] = useState(false);

  const handleCardClick = async () => {
    if (!instanceAuth) return flipCard();
    const result = await registrationInfo({ auth: instanceAuth, url });
    if (result.error) {
      setInstanceStatus({ ...instanceStatus, instance: 'UNABLE TO CONNECT', instanceError: true });
      return alert.error('Unable to connect to instance.');
    }
    return history.push(`/instance/${compute_stack_id}/browse`);
  };

  useAsyncEffect(async () => {
    const registrationResult = await handleInstanceRegistration({ auth, instanceAuth, url, is_local, instance_id, compute, storage, license, compute_stack_id, stripe_product_id });
    if (['PLEASE LOG IN', 'LOGIN FAILED'].includes(registrationResult.instance)) {
      if (instanceAuth) {
        setInstanceAuths({ ...instanceAuths, [compute_stack_id]: false });
      }
      if (['PLEASE LOG IN', 'LOGIN FAILED', 'UNABLE TO CONNECT'].includes(instanceStatus.instance)) {
        registrationResult.instance = 'LOGIN FAILED';
      }
    }
    return setInstanceStatus({ ...instanceStatus, ...registrationResult });
  }, [status, license, instanceAuth, lastUpdate]);

  useInterval(() => {
    if (instanceStatus.instance === 'UNABLE TO CONNECT') {
      setLastUpdate(Date.now());
    }
  }, 5000);

  return (
    <Card className="instance" onClick={() => handleCardClick({ instanceAuth, flipCard, instanceStatus, url, setInstanceStatus, history, compute_stack_id, alert })}>
      <CardBody>
        <Row>
          <Col xs="10" className="instance-name">
            {instance_name}<br />
            <span className="text-smaller">{compute_stack_id.split('-')[3]}</span>
          </Col>
          <Col xs="2" className="text-right">
            {['CREATE_IN_PROGRESS', 'LOADING'].includes(instanceStatus.instance) ? (
              <i title="Instance Is Being Created" className="fa fa-spinner fa-spin text-purple" />
            ) : instanceStatus.instance === 'COULD NOT CONNECT' ? (
              <i title="Could not connect to instance" className="fa fa-exclamation-triangle text-danger" />
            ) : instanceAuths[compute_stack_id] ? (
              <i onClick={(e) => { e.stopPropagation(); setInstanceAuths({ ...instanceAuths, [compute_stack_id]: false }); }} title="Remove Instance Authentication" className="fa fa-lock text-purple" />
            ) : (
              <i title="Instance Requires Authentication" className="fa fa-unlock-alt text-danger" />
            )}
          </Col>
        </Row>
        <hr className="mt-3 mb-1" />
        <Row className="text-smaller text-nowrap text-darkgrey">
          <Col xs="3">STATUS</Col>
          <Col xs="9" className={`text-bold text-${instanceStatus.instanceError ? 'danger' : 'success'}`}>{instanceStatus.instance?.replace(/_/g, ' ').toUpperCase()}</Col>
          <Col xs="12"><hr className="my-1" /></Col>
          <Col xs="3">TYPE</Col>
          <Col xs="9">{is_local ? 'USER INSTALLED' : 'HARPERDB CLOUD'}</Col>
          <Col xs="12"><hr className="my-1" /></Col>
          <Col xs="3">URL</Col>
          <Col xs="9"><div className="overflow-hidden">{url && url.split('//')[1]}</div></Col>
          <Col xs="12"><hr className="my-1" /></Col>
          <Col xs="3">LICENSE</Col>
          <Col xs="9" className={`text-${instanceStatus.licenseError ? 'danger' : ''}`}>{instanceStatus.license.toUpperCase()}</Col>
          <Col xs="12"><hr className="my-1" /></Col>
          <Col xs="3">CLUSTERING</Col>
          <Col xs="9">{instanceStatus.clustering.toUpperCase()}</Col>
        </Row>
      </CardBody>
    </Card>
  );
};
