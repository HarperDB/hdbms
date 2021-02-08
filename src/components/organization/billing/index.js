import React, { useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import CreditCard from './Card';
import Invoices from './Invoices';
import Coupons from './Coupons';
import getCustomer from '../../../functions/api/lms/getCustomer';
import appState from '../../../functions/state/appState';

const BillingIndex = () => {
  const { customer_id } = useParams();
  const auth = useStoreState(appState, (s) => s.auth);

  useEffect(
    () => getCustomer({ auth, customer_id }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
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
};

export default BillingIndex;
