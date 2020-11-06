import React from 'react';
import { Col, Row } from 'reactstrap';

import SystemInfo from './systemInfo';
import Logs from './logs';
import Jobs from './jobs';

const MetricsIndex = () => (
  <>
    <Row id="config">
      <Col xs="12">
        <SystemInfo />
      </Col>
      <Col lg="6" xs="12">
        <Logs />
      </Col>
      <Col lg="6" xs="12">
        <Jobs />
      </Col>
    </Row>
  </>
);

export default MetricsIndex;
