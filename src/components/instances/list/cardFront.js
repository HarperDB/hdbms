import React, { useState } from 'react';
import { Card, CardBody, Col, Row } from '@nio/ui-kit';
import { useHistory } from 'react-router';
import { useAlert } from 'react-alert';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';

import appState from '../../../state/stores/appState';
import useInstanceAuth from '../../../state/stores/instanceAuths';

import handleInstanceRegistration from '../../../util/instance/handleInstanceRegistration';

export default ({ compute_stack_id, instance_id, url, status, instance_name, is_local, flipCard, compute, storage, license, stripe_product_id }) => {
  const auth = useStoreState(appState, (s) => s.auth);
  const history = useHistory();
  const alert = useAlert();
  const [instanceStatus, setInstanceStatus] = useState({ instance: 'LOADING', instanceError: false, license: '', licenseError: false, clustering: '' });
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});
  const instanceAuth = instanceAuths && instanceAuths[compute_stack_id];

  useAsyncEffect(async () => {
    if (!instanceAuth) {
      setInstanceStatus({ ...instanceStatus, instance: 'OK', license: 'PLEASE LOG IN', clustering: 'PLEASE LOG IN' });
    } else if (status === 'CREATE_IN_PROGRESS') {
      setInstanceStatus({ ...instanceStatus, instance: status });
    } else {
      const registrationResult = await handleInstanceRegistration({ auth, instanceAuth, url, is_local, instance_id, compute, storage, license, compute_stack_id, stripe_product_id });
      setInstanceStatus({ ...instanceStatus, ...registrationResult });
    }
  }, [status, license, instanceAuth]);

  const handleClick = () => {
    if (instanceStatus.instance !== 'OK') return alert.error('Instance is not currently available.');
    if (!instanceAuth) return flipCard();
    return history.push(`/instance/${compute_stack_id}/browse`);
  };

  return (
    <Card className="instance" onClick={handleClick}>
      <CardBody>
        <Row>
          <Col xs="10" className="instance-name">
            {instance_name}
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
        <hr className="mt-4 mb-1" />
        <Row className="text-smaller text-nowrap text-darkgrey">
          <Col xs="3">STATUS</Col>
          <Col xs="9" className={`text-bold text-${instanceStatus.instanceError ? 'danger' : 'success'}`}>{instanceStatus.instance?.replace(/_/g, ' ').toUpperCase()}</Col>
          <Col xs="12"><hr className="my-1" /></Col>
          <Col xs="3">TYPE</Col>
          <Col xs="9">{is_local ? 'USER INSTALLED' : 'HARPERDB CLOUD'}</Col>
          <Col xs="12"><hr className="my-1" /></Col>
          <Col xs="3">URL</Col>
          <Col xs="9" className="overflow-hidden">{url}</Col>
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
