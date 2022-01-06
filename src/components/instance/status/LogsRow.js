import React from 'react';
import { Row, Col } from 'reactstrap';

import isObject from '../../../functions/util/isObject';

function LogsRow({ level, timestamp, message }) {
  return <div className="item-row">
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
        {isObject(message) && message.error ? message.error : isObject(message) ? JSON.stringify(message) : message}
      </Col>
    </Row>
  </div>
}

export default LogsRow;
