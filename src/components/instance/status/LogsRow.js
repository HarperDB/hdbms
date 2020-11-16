import React from 'react';
import { Row, Col } from 'reactstrap';

import isObject from '../../../functions/util/isObject';

const LogsRow = ({ level, timestamp, message }) => (
  <div className="item-row">
    <Row>
      <Col xs="3" className={`text-nowrap ${level.toLowerCase()}`}>
        {level.toUpperCase()}
      </Col>
      <Col xs="3" className="text-nowrap">
        {new Date(timestamp).toLocaleDateString()}
      </Col>
      <Col xs="6" className="text-nowrap">
        {new Date(timestamp).toLocaleTimeString()}
      </Col>
      <Col xs="12" className="mt-1">
        {isObject(message) ? JSON.stringify(message) : message}
      </Col>
    </Row>
  </div>
);

export default LogsRow;