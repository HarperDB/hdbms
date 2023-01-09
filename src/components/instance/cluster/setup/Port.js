import React from 'react';
import { Row, Col } from 'reactstrap';

function Port({ port }) {
  return (
    <Row>
      <Col xs="12">
        <hr className="my-3" />
      </Col>
      <Col xs="10" className="text">
        Cluster Port: {port}
      </Col>
      <Col xs="2" className="text-end">
        <i className="fa fa-check-circle fa-lg text-success" />
      </Col>
    </Row>
  );
}

export default Port;
