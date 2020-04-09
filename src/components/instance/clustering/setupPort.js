import React from 'react';
import { Row, Col } from '@nio/ui-kit';

export default ({ port }) => (
  <Row>
    <Col xs="12">
      <hr />
    </Col>
    <Col xs="10" className="text">
      Cluster Port {port}
    </Col>
    <Col xs="2" className="text-right">
      <i className="fa fa-check-circle fa-lg text-success" />
    </Col>
  </Row>
);
