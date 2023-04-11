import React from 'react';
import { Col, Row } from 'reactstrap';

import SystemInfo from './SystemInfo';
import Logs from './Logs';
import Jobs from './Jobs';
import Alarms from './Alarms';


export const metadata = {
  path: `status`,
  link: 'status',
  label: 'status',
  icon: 'tachometer',
  iconCode: 'f0e4',
}
function MetricsIndex() {
  return <Row id="config">
      <Col xs="12">
        <SystemInfo />
      </Col>
      <Col lg="7" xs="12">
        <Logs />
      </Col>
      <Col lg="5" xs="12">
        <Jobs />
      </Col>
      <Col lg="4" xs="12">
        <Alarms />
      </Col>
    </Row>
}

export default MetricsIndex;
