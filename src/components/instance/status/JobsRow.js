import React from 'react';
import { Row, Col } from 'reactstrap';
import isObject from '../../../functions/util/isObject';
function JobsRow({
  endDatetime,
  startDatetime,
  status,
  message
}) {
  return <div className="item-row">
    <Row>
      <Col xs="3" className={`text-nowrap ${status.toLowerCase()}`}>
        {status}
      </Col>
      <Col xs="3" className="text-nowrap">
        {new Date(startDatetime).toLocaleDateString()}
      </Col>
      <Col xs="3" className="text-nowrap">
        {new Date(startDatetime).toLocaleTimeString()}
      </Col>
      <Col xs="3" className="text-nowrap">
        {new Date(endDatetime).toLocaleTimeString()}
      </Col>
      <Col xs="12" className="mt-1">
        {isObject(message) ? JSON.stringify(message) : message}
      </Col>
    </Row>
  </div>;
}
export default JobsRow;