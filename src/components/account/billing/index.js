import React from 'react';
import { Row, Col, Card, CardBody } from '@nio/ui-kit';

import CreditCard from './card';
import Invoices from './invoices';

export default () => (
  <Row>
    <Col md="6" className="mb-4">
      <span className="text-white mb-2 floating-card-header">card</span>
      <Card className="my-3">
        <CardBody>
          <CreditCard />
        </CardBody>
      </Card>
    </Col>
    <Col md="6" className="mb-4">
      <span className="text-white mb-2 floating-card-header">invoices</span>
      <Card className="my-3">
        <CardBody>
          <Invoices />
        </CardBody>
      </Card>
    </Col>
  </Row>
);
