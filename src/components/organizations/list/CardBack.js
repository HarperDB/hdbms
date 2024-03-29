import React from 'react';

import CardBackLeave from './CardBackLeave';
import CardBackDelete from './CardBackDelete';

// eslint-disable-next-line react/destructuring-assignment
function CardBack(params) {
  return params.flipState === 'leave' ? <CardBackLeave {...params} /> : <CardBackDelete {...params} />
}

export default CardBack;
