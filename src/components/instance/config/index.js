import React from 'react';
import { Col, Row } from '@nio/ui-kit';

import UpdateInstanceForm from './updateInstanceForm';
import ConfigDetails from './configDetails';

export default () => (
  <Row id="config">
    <Col xl="3" lg="4" md="5" xs="12">
      <span className="text-white mb-2 floating-card-header">resize instance</span>
      <UpdateInstanceForm />
    </Col>
    <Col xl="9" lg="8" md="7" xs="12">
      <span className="text-white mb-2 floating-card-header">instance details</span>
      <ConfigDetails />
    </Col>
  </Row>
);
