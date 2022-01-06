import React from 'react';

import CardBackLogin from './CardBackLogin';
import CardBackDelete from './CardBackDelete';

// eslint-disable-next-line react/destructuring-assignment
function CardBack(params) {
  return params.flipState === 'login' ? <CardBackLogin {...params} /> : <CardBackDelete {...params} />
}

export default CardBack;
