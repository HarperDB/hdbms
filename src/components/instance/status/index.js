import React from 'react';
import { Col, Row } from 'reactstrap';

import SystemInfo from './systemInfo';
import Logs from './logs';
import Jobs from './jobs';
import Alarms from './alarms';

const MetricsIndex = () => (
  <>
    <Row id="config">
      <Col xs="12">
        <SystemInfo />
      </Col>
      <Col lg="4" xs="12">
        <Logs />
      </Col>
      <Col lg="4" xs="12">
        <Jobs />
      </Col>
      <Col lg="4" xs="12">
        <Alarms />
      </Col>
    </Row>
  </>
);

export default MetricsIndex;
