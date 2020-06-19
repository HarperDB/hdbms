import React from 'react';
import { Col, Row } from '@nio/ui-kit';

import SystemInfo from './systemInfo';
import InstanceLogs from './instanceLogs';
import InstanceJobs from './instanceJobs';

export default () => (
  <Row id="config">
    <Col xs="12">
      <SystemInfo />
    </Col>
    <Col lg="6" xs="12">
      <InstanceLogs />
    </Col>
    <Col lg="6" xs="12">
      <InstanceJobs />
    </Col>
  </Row>
);
