import React from 'react';
import { Col, Row } from 'reactstrap';

import SystemInfo from './SystemInfo';
import Logs from './Logs';
import Jobs from './Jobs';
import Alarms from './Alarms';

function MetricsIndex() {
  return (
    <Row id="config">
      <Col xs="12">
        <SystemInfo />
      </Col>
      <Col lg="6" xs="12">
        <Logs />
      </Col>
      <Col lg="3" xs="12">
        <Jobs />
      </Col>
      <Col lg="3" xs="12">
        <Alarms />
      </Col>
    </Row>
  );
}

export default MetricsIndex;
