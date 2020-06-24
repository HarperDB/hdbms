import React, { useState, useEffect } from 'react';
import ReactCardFlip from 'react-card-flip';
import { Col } from '@nio/ui-kit';
import { ErrorBoundary } from 'react-error-boundary';

import CardFront from './cardFront';
import CardBack from './cardBack';
import ErrorFallbackCard from '../../shared/errorFallbackCard';
import addError from '../../../api/lms/addError';

const OrgCard = ({ flippedCard, setFlippedCard, customer_id, ...rest }) => {
  const [flipState, setFlipState] = useState(false);

  useEffect(() => {
    if (flippedCard !== customer_id) {
      setFlipState(false);
    }
  }, [flippedCard]);

  useEffect(() => {
    if (flipState) {
      setFlippedCard(customer_id);
    }
  }, [flipState]);

  return (
    <Col xs="12" md="6" lg="4" xl="3" className="mb-4">
      <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id })} FallbackComponent={ErrorFallbackCard}>
        <ReactCardFlip infinite isFlipped={flipState} flipSpeedBackToFront={0.25} flipSpeedFrontToBack={0.25} flipDirection="vertical">
          <CardFront setFlipState={setFlipState} flipState={flipState} customer_id={customer_id} {...rest} />
          <CardBack setFlipState={setFlipState} flipState={flipState} customer_id={customer_id} {...rest} />
        </ReactCardFlip>
      </ErrorBoundary>
    </Col>
  );
};

export default OrgCard;
