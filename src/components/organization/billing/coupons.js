import React from 'react';
import { Row, Col } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import appState from '../../../state/appState';

import CouponForm from '../../shared/couponForm';

export default () => {
  const stripe_coupons = useStoreState(appState, (s) => s.customer.stripe_coupons);

  return stripe_coupons ? (
    <Row>
      <Col xs="6">
        <b>{stripe_coupons.name}</b>
      </Col>
      <Col xs="6" className="text-right">
        <b>${parseInt(stripe_coupons.amount_off / 100, 10)}</b>
      </Col>
    </Row>
  ) : (
    <CouponForm />
  );
};
