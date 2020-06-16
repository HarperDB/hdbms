import React, { Fragment } from 'react';
import { Row, Col, Card, CardBody } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import appState from '../../../state/appState';

import CouponForm from '../../shared/couponForm';

export default () => {
  const stripe_coupons = useStoreState(appState, (s) => s.customer.stripe_coupons);

  return (
    <Card>
      <CardBody>
        <CouponForm />
        {stripe_coupons?.length ? (
          <div className="mt-4">
            {stripe_coupons.map((coupon) => (
              <Fragment key={coupon.id}>
                <hr className="my-2" />
                <Row>
                  <Col xs="6">{coupon.name}</Col>
                  <Col xs="6" className="text-right">
                    ${parseInt(coupon.amount_off / 100, 10)}
                  </Col>
                </Row>
              </Fragment>
            ))}
            <hr className="my-2" />
            <Row>
              <Col xs="6">
                <b>Total Credit</b>
              </Col>
              <Col xs="6" className="text-right">
                <b>${stripe_coupons.reduce((total, coupon) => total + parseInt(coupon.amount_off / 100, 10), 0)}</b>
              </Col>
            </Row>
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
};
