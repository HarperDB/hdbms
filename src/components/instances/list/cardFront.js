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
  const [instanceStatus, setInstanceStatus] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('connecting');
  const [instanceAuths] = useInstanceAuth({});

  useAsyncEffect(async () => {
    if (instanceAuths[compute_stack_id]) {
      if (status === 'CREATE_IN_PROGRESS') {
        setInstanceStatus('creating');
      } else {
        try {
          const response = await queryInstance({ operation: 'describe_all' }, instanceAuths[compute_stack_id], url);
          if (response.error) {
            setInstanceStatus(response);
          } else {
            setInstanceStatus('ready');
          }
        } catch (e) {
          setInstanceStatus({ error: false, message: 'loading' });
        }
      }
    }
  }, [lastUpdate]);

  return (
    <Card className="instance" onClick={() => (hasAuth ? history.push(`/instance/${compute_stack_id}/browse`) : alert.error('You must log in first.') && flipCard())}>
      <CardBody>
        <Row>
          <Col xs="10" className="instance-name">
            {instance_name}
          </Col>
          <Col xs="2" className="text-right">
            {!instanceStatus ? (
              <i title="Instance Status Loading" className="fa fa-spinner fa-spin text-grey" />
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
            {/*<Col xs="3">URL</Col>
            <Col xs="9">{url}</Col>*/}
            <Col xs="3">STATUS</Col>
            <Col xs="9" className={`text-${instanceStatus.error ? 'danger' : 'success'}`}>{instanceStatus.message}</Col>
            <Col xs="12"><hr className="my-1" /></Col>
            <Col xs="3">TYPE</Col>
            <Col xs="9">{is_local ? 'Local' : 'HarperDB Cloud'}</Col>
            <Col xs="12"><hr className="my-1" /></Col>
            <Col xs="3">RAM</Col>
            <Col xs="9">{compute ? compute.ram : <i className="fa fa-spinner fa-spin text-purple" />}</Col>
            <Col xs="12"><hr className="my-1" /></Col>
            <Col xs="3">STORAGE</Col>
            <Col xs="9">{storage ? storage.disk_space : 'n/a'}</Col>
            <Col xs="12"><hr className="mt-1 mb-0" /></Col>
          </Row>
        </div>
      </CardBody>
    </Card>
  );
};
