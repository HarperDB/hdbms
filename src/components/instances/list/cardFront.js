import React from 'react';
import { Card, CardBody, Col, Row } from '@nio/ui-kit';
import { useHistory } from 'react-router';
import { useAlert } from 'react-alert';

export default ({ id, instance_name, host, port, is_ssl, is_local, flipCard, setAuth, hasAuth, compute, storage }) => {
  const history = useHistory();
  const alert = useAlert();

  return (
    <Card className="instance" onClick={() => (hasAuth ? history.push(`/instances/${id}/browse`) : alert.error('You must log in first.') && flipCard())}>
      <CardBody>
        <Row>
          <Col xs="10" className="instance-name">
            {instance_name}
          </Col>
          <Col xs="2" className="text-right">
            {hasAuth ? (
              <i onClick={(e) => { e.stopPropagation(); setAuth({ id, user: false, pass: false }); }} title="Remove Instance Authentication" className="fa fa-lock text-purple" />
            ) : (
              <i title="Instance Requires Authentication" className="fa fa-unlock-alt text-danger" />
            )}
          </Col>
        </Row>
        <hr className="mt-3 mb-1" />
        <div className="scrollable">
          <Row className="text-smaller text-nowrap text-darkgrey">
            <Col xs="3">URL</Col>
            <Col xs="9">http{is_ssl && 's'}://{host}:{port}</Col>
            <Col xs="12"><hr className="my-1" /></Col>
            <Col xs="3">TYPE</Col>
            <Col xs="9">{is_local ? 'Local' : 'HarperDB Cloud'}</Col>
            <Col xs="12"><hr className="my-1" /></Col>
            <Col xs="3">RAM</Col>
            <Col xs="9">{compute ? compute.ram : <i className="fa fa-spinner fa-spin text-purple" />}</Col>
            <Col xs="12"><hr className="my-1" /></Col>
            <Col xs="3">STORAGE</Col>
            <Col xs="9">{storage? storage.disk_space : <i className="fa fa-spinner fa-spin text-purple" />}</Col>
          </Row>
        </div>
      </CardBody>
    </Card>
  );
};
