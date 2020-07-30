import React from 'react';
import { Row, Col } from 'reactstrap';

export default ({ end_datetime, start_datetime, status, message }) => (
  <div className="log-row">
    <Row>
      <Col xs="3" className={status.toLowerCase()}>
        {status}
      </Col>
      <Col xs="3">{new Date(start_datetime).toLocaleDateString()}</Col>
      <Col xs="3">{new Date(start_datetime).toLocaleTimeString()}</Col>
      <Col xs="3">{new Date(end_datetime).toLocaleTimeString()}</Col>
      <Col xs="12" className="mt-1">
        {message}
      </Col>
    </Row>
  </div>
);
