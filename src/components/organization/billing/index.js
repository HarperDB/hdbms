import React from 'react';
import { Row, Col, Card, CardBody } from '@nio/ui-kit';

import CreditCard from './card';
import Invoices from './invoices';
import Coupons from './coupons';

export default () => (
  <Row>
    <Col md="6" className="mb-4">
      <span className="floating-card-header">card</span>
      <Card className="my-3">
        <CardBody>
          <CreditCard />
        </CardBody>
      </Card>
    </Col>
    <Col md="6" className="mb-4">
      <span className="floating-card-header">coupons</span>
      <Card className="my-3">
        <CardBody>
          <Coupons />
        </CardBody>
      </Card>
      <span className="floating-card-header">invoices</span>
      <Card className="my-3">
        <CardBody>
          <Invoices />
        </CardBody>
      </Card>
    </Col>
  </Row>
);
