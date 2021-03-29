import React from 'react';

import CardBackLogin from './CardBackLogin';
import CardBackDelete from './CardBackDelete';

// eslint-disable-next-line react/destructuring-assignment
const CardBack = (params) => (params.flipState === 'login' ? <CardBackLogin {...params} /> : <CardBackDelete {...params} />);

export default CardBack;
