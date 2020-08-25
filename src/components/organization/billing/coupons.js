import React, { Fragment } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useParams } from 'react-router';
import { useStoreState } from 'pullstate';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../../../state/appState';

import CouponForm from '../../shared/couponForm';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../api/lms/addError';

export default () => {
  const { customer_id } = useParams();
  const stripe_coupons = useStoreState(appState, (s) => s.customer.stripe_coupons);

  return (
    <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id })} FallbackComponent={ErrorFallback}>
      <Card className="my-3">
        <CardBody>
          <CouponForm />
          {stripe_coupons?.length ? (
            <div className="mt-2">
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
    </ErrorBoundary>
  );
};
