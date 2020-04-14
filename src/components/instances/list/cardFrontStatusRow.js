import React from 'react';
import { Col, Row } from '@nio/ui-kit';

const CardFrontStatusRow = ({ label, value, textClass = '', showInstanceInfoRows, bottomDivider = false }) => (
  <Row className="text-smaller text-nowrap text-darkgrey">
    <Col xs="4">{label}</Col>
    <Col xs="8" className={textClass}>
      {showInstanceInfoRows ? value : ''}
    </Col>
    {bottomDivider && (
      <Col xs="12">
        <hr className="my-1" />
      </Col>
    )}
  </Row>
);

export default CardFrontStatusRow;
