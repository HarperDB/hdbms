import React, { useState } from 'react';
import { Card, CardBody, Col, Row } from '@nio/ui-kit';
import { useHistory } from 'react-router';
import { useAlert } from 'react-alert';
import useAsyncEffect from 'use-async-effect';

import queryInstance from '../../../api/queryInstance';
import useInstanceAuth from '../../../state/stores/instanceAuths';

export default ({ compute_stack_id, url, status, instance_name, is_local, flipCard, setAuth, hasAuth, compute, storage }) => {
  const history = useHistory();
  const alert = useAlert();
  const [instanceStatus, setInstanceStatus] = useState('');
  const [instanceAuths] = useInstanceAuth({});

  useAsyncEffect(async () => {
    if (instanceAuths[compute_stack_id]) {
      if (status === 'CREATE_IN_PROGRESS') {
        setInstanceStatus(status);
      } else {
        try {
          const response = await queryInstance({ operation: 'describe_all' }, instanceAuths[compute_stack_id], url);
          if (response.error) {
            setInstanceStatus('could not connect');
          } else {
            setInstanceStatus('OK');
          }
        } catch (e) {
          setInstanceStatus('LOADING');
        }
      }
    }
  }, [status]);

  const handleClick = () => {
    if (instanceStatus !== 'OK') return alert.error('Instance is not currently available.');
    if (!hasAuth) return flipCard();
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
            {instanceStatus === 'CREATE_IN_PROGRESS' ? (
              <i title="Instance Is Being Created" className="fa fa-spinner fa-spin text-purple" />
            ) : instanceStatus !== 'OK' ? (
              <i title="Instance Is Not OK" className="fa fa-exclamation-triangle text-danger" />
            ) : hasAuth ? (
              <i onClick={(e) => { e.stopPropagation(); setAuth({ compute_stack_id, user: false, pass: false }); }} title="Remove Instance Authentication" className="fa fa-lock text-purple" />
            ) : (
              <i title="Instance Requires Authentication" className="fa fa-unlock-alt text-danger" />
            )}
          </Col>
        </Row>
        <hr className="mt-4 mb-1" />
        <div className="scrollable">
          <Row className="text-smaller text-nowrap text-darkgrey">
            <Col xs="3">STATUS</Col>
            <Col xs="9" className={`text-${instanceStatus !== 'OK' ? 'danger' : 'success'}`}>{instanceStatus && instanceStatus.replace(/_/g, ' ').toUpperCase()}</Col>
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
