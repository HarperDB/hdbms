import React from 'react';
import { Row, Col, Card, CardBody } from '@nio/ui-kit';

import CreditCard from './card';
import Invoices from './invoices';
import Coupons from './coupons';

export default () => (
  <Row>
    <Col md="6">
      <span className="floating-card-header">coupons</span>
      <Card className="mt-3 mb-4">
        <CardBody>
          <Coupons />
        </CardBody>
      </Card>
      <span className="floating-card-header">card</span>
      <Card className="mt-3 mb-4">
        <CardBody>
          <CreditCard />
        </CardBody>
      </Card>
    </Col>
    <Col md="6">
      <span className="floating-card-header">invoices</span>
      <Card className="mt-3 mb-4">
        <CardBody>
          <Invoices />
        </CardBody>
      </Card>
    </Col>
  </Row>
);
