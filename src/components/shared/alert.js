import React from 'react';
import { Row, Col } from '@nio/ui-kit';

export default ({ message, options, close }) => (
  <div className={`alert ${options.type}`} onClick={close}>
    <Row>
      <Col xs="2" className="text-white">
        {options.type === 'info' && <i className="fa fa-2x fa-info-circle" />}
        {options.type === 'success' && <i className="fa fa-2x fa-check-circle" />}
        {options.type === 'error' && <i className="fa fa-2x fa-exclamation-circle" />}
      </Col>
      <Col xs="10" className="text-white message">
        {message}
      </Col>
    </Row>
  </div>
);
