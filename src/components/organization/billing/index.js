import React from 'react';
import { Row, Col } from 'reactstrap';

import CreditCard from './Card';
import Invoices from './Invoices';
import Coupons from './Coupons';

const BillingIndex = () => (
  <Row>
    <Col md="6">
      <span className="floating-card-header">coupons</span>
      <Coupons />
      <br />
      <span className="floating-card-header">card</span>
      <CreditCard />
    </Col>
    <Col md="6">
      <span className="floating-card-header">invoices</span>
      <Invoices />
    </Col>
  </Row>
);

export default BillingIndex;
