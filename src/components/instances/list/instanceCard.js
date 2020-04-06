import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import { Col } from '@nio/ui-kit';

import CardFront from './cardFront';
import CardBack from './cardBack';

export default (props) => {
  const [flipState, setFlipState] = useState(false);
  return (
    <Col xs="12" md="6" lg="4" xl="3" className="mb-4">
      <ReactCardFlip isFlipped={flipState}>
        <CardFront showLogin={() => setFlipState('login')} showDelete={() => setFlipState('delete')} {...props} />
        <CardBack flipCard={() => setFlipState(false)} flipState={flipState} {...props} />
      </ReactCardFlip>
    </Col>
  );
};
