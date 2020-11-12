import React from 'react';
import { Row, Col } from 'reactstrap';

import isObject from '../../../functions/util/isObject';

const AlarmsRow = ({ date, type, message }) => (
  <div className="log-row">
    <Row>
      <Col xs="3" className="text-danger">
        {type}
      </Col>
      <Col xs="9">{new Date(date).toLocaleString()}</Col>
      <Col xs="12" className="mt-1">
        {isObject(message) ? JSON.stringify(message) : message}
      </Col>
    </Row>
  </div>
);

export default AlarmsRow;
