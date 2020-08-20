import React from 'react';
import { Row, Col } from 'reactstrap';

import CreditCard from './card';
import Invoices from './invoices';
import Coupons from './coupons';

export default () => (
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
