import React from 'react';
import { Row, Col } from '@nio/ui-kit';

export default ({ level, timestamp, message }) => (
  <div className={`log-row ${level}`}>
    <Row>
      <Col xl="3" lg="12" md="3">
        {new Date(timestamp).toLocaleString()}
      </Col>
      <Col xl="9" lg="12" md="9">
        {message}
      </Col>
    </Row>
  </div>
);
