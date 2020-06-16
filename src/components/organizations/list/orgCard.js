import React, { useState, useEffect } from 'react';
import ReactCardFlip from 'react-card-flip';
import { Col } from '@nio/ui-kit';

import CardFront from './cardFront';
import CardBack from './cardBack';

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
      <ReactCardFlip infinite isFlipped={flipState} flipSpeedBackToFront={0.25} flipSpeedFrontToBack={0.25} flipDirection="vertical">
        <CardFront setFlipState={setFlipState} flipState={flipState} customer_id={customer_id} {...rest} />
        <CardBack setFlipState={setFlipState} flipState={flipState} customer_id={customer_id} {...rest} />
      </ReactCardFlip>
    </Col>
  );
};

export default OrgCard;
