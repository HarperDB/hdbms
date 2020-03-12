import React, { useState } from 'react';
import { Card, CardBody, Col, Row } from '@nio/ui-kit';
import { useHistory } from 'react-router';
import { useAlert } from 'react-alert';
import useAsyncEffect from 'use-async-effect';

import queryInstance from '../../../api/queryInstance';
import useInstanceAuth from '../../../state/stores/instanceAuths';
import addUser from '../../../api/instance/addUser';
import dropUser from '../../../api/instance/dropUser';

export default ({ compute_stack_id, instance_id, url, status, instance_name, is_local, flipCard, compute, storage }) => {
  const history = useHistory();
  const alert = useAlert();
  const [instanceStatus, setInstanceStatus] = useState('LOADING');
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});

  useAsyncEffect(async () => {
    if (instanceAuths[compute_stack_id]) {
      if (status === 'CREATE_IN_PROGRESS') {
        setInstanceStatus(status);
      } else {
        try {
          const response = await queryInstance({ operation: 'describe_all' }, instanceAuths[compute_stack_id], url);
          if (response.error) {
            if (!is_local) {
              const roles = await queryInstance({ operation: 'list_roles' }, { user: instance_id, pass: instance_id }, url);
              const role = roles.find((r) => r.permission.super_user).id;
              await addUser({ auth: { user: instance_id, pass: instance_id }, role, username: instanceAuths[compute_stack_id].user, password: instanceAuths[compute_stack_id].pass, url });
              await dropUser({ auth: instanceAuths[compute_stack_id], username: instance_id, url });
              setInstanceStatus('OK');
            } else {
              setInstanceStatus('OK');
              setInstanceAuths({ ...instanceAuths, [compute_stack_id]: undefined });
            }
          } else {
            setInstanceStatus('OK');
          }
        } catch (e) {
          setInstanceStatus('COULD NOT CONNECT');
        }
      }
    } else {
      setInstanceStatus('OK');
    }
  }, [status]);

  const handleClick = () => {
    if (instanceStatus !== 'OK') return alert.error('Instance is not currently available.');
    if (!instanceAuths[compute_stack_id]) return flipCard();
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
            {['CREATE_IN_PROGRESS', 'LOADING'].includes(instanceStatus) ? (
              <i title="Instance Is Being Created" className="fa fa-spinner fa-spin text-purple" />
            ) : instanceStatus === 'COULD NOT CONNECT' ? (
              <i title="Could not connect to instance" className="fa fa-exclamation-triangle text-danger" />
            ) : instanceAuths[compute_stack_id] ? (
              <i onClick={(e) => { e.stopPropagation(); setInstanceAuths({ ...instanceAuths, [compute_stack_id]: false }); }} title="Remove Instance Authentication" className="fa fa-lock text-purple" />
            ) : (
              <i title="Instance Requires Authentication" className="fa fa-unlock-alt text-danger" />
            )}
          </Col>
        </Row>
        <hr className="mt-4 mb-1" />
        <div className="scrollable">
          <Row className="text-smaller text-nowrap text-darkgrey">
            <Col xs="3">STATUS</Col>
            <Col xs="9" className={`text-${['OK', 'LOADING'].includes(instanceStatus) ? 'success' : 'danger'}`}>{instanceStatus && instanceStatus.replace(/_/g, ' ').toUpperCase()}</Col>
            <Col xs="12"><hr className="my-1" /></Col>
            <Col xs="3">URL</Col>
            <Col xs="9">{url}</Col>
            <Col xs="12"><hr className="my-1" /></Col>
            <Col xs="3">TYPE</Col>
            <Col xs="9">{is_local ? 'Local' : 'HarperDB Cloud'}</Col>
            <Col xs="12"><hr className="my-1" /></Col>
            <Col xs="3">LICENSE</Col>
            <Col xs="9">{compute.ram} RAM {storage && `/ ${storage.disk_space} Storage`}</Col>
          </Row>
        </div>
      </CardBody>
    </Card>
  );
};
