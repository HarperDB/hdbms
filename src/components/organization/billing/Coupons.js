import React, { Fragment } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { ErrorBoundary } from 'react-error-boundary';
import appState from '../../../functions/state/appState';
import CouponForm from '../../shared/CouponForm';
import ErrorFallback from '../../shared/ErrorFallback';
import addError from '../../../functions/api/lms/addError';
function Coupons() {
  const {
    customerId
  } = useParams();
  const stripeCoupons = useStoreState(appState, s => s.customer.stripeCoupons);
  return <ErrorBoundary onError={(error, componentStack) => addError({
    error: {
      message: error.message,
      componentStack
    },
    customerId
  })} FallbackComponent={ErrorFallback}>
      <Card className="my-3">
        <CardBody>
          <CouponForm />
          {stripeCoupons?.length ? <div className="mt-2">
              {stripeCoupons.map(coupon => <Fragment key={coupon.id}>
                  <hr className="my-2" />
                  <Row>
                    <Col xs="6">{coupon.name}</Col>
                    <Col xs="6" className="text-end">
                      ${parseInt(coupon.amountOff / 100, 10)}
                    </Col>
                  </Row>
                </Fragment>)}
              <hr className="my-2" />
              <Row>
                <Col xs="6">
                  <b>Total Credit</b>
                </Col>
                <Col xs="6" className="text-end">
                  <b>${stripeCoupons.reduce((total, coupon) => total + parseInt(coupon.amountOff / 100, 10), 0)}</b>
                </Col>
              </Row>
            </div> : null}
        </CardBody>
      </Card>
    </ErrorBoundary>;
}
export default Coupons;