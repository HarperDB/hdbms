import React from 'react';
import { Row, Col } from 'reactstrap';

import isObject from '../../../functions/util/isObject';

function LogsRow({ level, timestamp, message }) {
  return <div className="item-row">
    <Row>
      <Col xs="3" className={`text-nowrap ${level?.toLowerCase()}`}>
        {level?.toUpperCase() || 'UNKNOWN'}
      </Col>
      <Col xs="3" className="text-nowrap">
        {new Date(timestamp || null).toLocaleDateString()}
      </Col>
      <Col xs="6" className="text-nowrap">
        {new Date(timestamp || null).toLocaleTimeString()}
      </Col>
      <Col xs="12" className="mt-1">
        {isObject(message) && message.error ? message.error : JSON.stringify(message).slice(1, -1)}
      </Col>
    </Row>
  </div>
}

export default LogsRow;
