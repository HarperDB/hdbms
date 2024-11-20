import React, { useState, useEffect } from 'react';
import { Col } from 'reactstrap';
import { ErrorBoundary } from 'react-error-boundary';
import CardFront from './CardFront';
import ErrorFallbackCard from '../../shared/ErrorFallbackCard';
import addError from '../../../functions/api/lms/addError';
import CardBackLogin from './CardBackLogin';
import CardBackDelete from './CardBackDelete';
function InstanceCard({
  flippedCard,
  setFlippedCard,
  computeStackId,
  customerId,
  ...rest
}) {
  const [flipState, setFlipState] = useState(false);
  useEffect(() => {
    if (flippedCard !== computeStackId) {
      setFlipState(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flippedCard]);
  useEffect(() => {
    if (flipState) {
      setFlippedCard(computeStackId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipState]);
  return <Col xs="12" md="6" lg="4" xl="3" className="mb-4 card-holder">
      <ErrorBoundary onError={(error, componentStack) => addError({
      error: {
        message: error.message,
        componentStack
      },
      customerId,
      computeStackId
    })} FallbackComponent={ErrorFallbackCard}>
        {!flipState ? <CardFront setFlipState={setFlipState} flipState={flipState} customer_id={customerId} compute_stack_id={computeStackId} {...rest} /> : flipState === 'login' ? <CardBackLogin setFlipState={setFlipState} flipState={flipState} customer_id={customerId} compute_stack_id={computeStackId} {...rest} /> : <CardBackDelete setFlipState={setFlipState} flipState={flipState} customer_id={customerId} compute_stack_id={computeStackId} {...rest} />}
      </ErrorBoundary>
    </Col>;
}
export default InstanceCard;