import React, { useState, useEffect } from 'react';
import { Col } from 'reactstrap';
import { ErrorBoundary } from 'react-error-boundary';
import CardFront from './CardFront';
import CardBack from './CardBack';
import ErrorFallbackCard from '../../shared/ErrorFallbackCard';
import addError from '../../../functions/api/lms/addError';
function OrgCard({
  flippedCard,
  setFlippedCard,
  customerId,
  ...rest
}) {
  const [flipState, setFlipState] = useState(false);
  useEffect(() => {
    if (flippedCard !== customerId) {
      setFlipState(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flippedCard]);
  useEffect(() => {
    if (flipState) {
      setFlippedCard(customerId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipState]);
  return <Col xs="12" md="6" lg="4" xl="3" className="mb-4">
      <ErrorBoundary onError={(error, componentStack) => addError({
      error: {
        message: error.message,
        componentStack
      },
      customerId
    })} FallbackComponent={ErrorFallbackCard}>
        {!flipState ? <CardFront setFlipState={setFlipState} flipState={flipState} customer_id={customerId} {...rest} /> : <CardBack setFlipState={setFlipState} flipState={flipState} customer_id={customerId} {...rest} />}
      </ErrorBoundary>
    </Col>;
}
export default OrgCard;