import React from 'react';
import { Col, Row } from 'reactstrap';

const CardFrontStatusRow = ({ label, value, textClass = '', isReady, bottomDivider = false }) => (
  <Row className="card-front-status-row text-darkgrey">
    <Col xs="4">{label}</Col>
    <Col xs="8" className={textClass}>
      {isReady ? value : ''}
    </Col>
    {bottomDivider && (
      <Col xs="12">
        <hr className="my-1" />
      </Col>
    )}
  </Row>
);

export default CardFrontStatusRow;
