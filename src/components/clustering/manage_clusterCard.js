import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import { Col } from '@nio/ui-kit';

import CardFront from './manage_cardFront';
import CardBack from './manage_cardBack';

export default (props) => {
  const [flipState, setFlipState] = useState(false);

  return (
    <Col xs="12" lg="6" xl="4" className="mb-4">
      <ReactCardFlip isFlipped={flipState}>
        <CardFront
          flipCard={() => setFlipState(true)}
          {...props}
        />

        <CardBack
          flipCard={() => setFlipState(false)}
          flipState={flipState}
          {...props}
        />
      </ReactCardFlip>
    </Col>
  );
};
