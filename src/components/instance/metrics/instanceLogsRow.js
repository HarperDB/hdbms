import React from 'react';
import { Row, Col } from 'reactstrap';

import isObject from '../../../functions/util/isObject';

export default ({ level, timestamp, message }) => (
  <div className="log-row">
    <Row>
      <Col xs="3" className={level.toLowerCase()}>
        {level.toUpperCase()}
      </Col>
      <Col xs="3">{new Date(timestamp).toLocaleDateString()}</Col>
      <Col xs="6">{new Date(timestamp).toLocaleTimeString()}</Col>
      <Col xs="12" className="mt-1">
        {isObject(message) ? JSON.stringify(message) : message}
      </Col>
    </Row>
  </div>
);
