import { Col, Row, Card, CardBody } from 'reactstrap';
import React from 'react';

export default ({ which, compute, storage, total }) => (
  <Card className="my-2">
    <CardBody className="p-2 text-small">
      <Row>
        <Col xs="6" className="text-nowrap">
          Compute
          {which === 'compute' && ' (new)'}
        </Col>
        <Col xs="6" className="text-nowrap text-right text-truncate">
          {compute}
        </Col>
        <Col xs="12">
          <hr className="my-1" />
        </Col>
      </Row>
      <Row>
        <Col xs="6" className="text-nowrap">
          Storage
          {which === 'storage' && ' (new)'}
        </Col>
        <Col xs="6" className="text-nowrap text-right text-truncate">
          {storage}
        </Col>
        <Col xs="12">
          <hr className="my-1" />
        </Col>
      </Row>
      <Row>
        <Col xs="6" className="text-nowrap">
          <b>New Total</b>
        </Col>
        <Col xs="6" className="text-nowrap text-right text-truncate">
          <b>{total}</b>
        </Col>
      </Row>
    </CardBody>
  </Card>
);
