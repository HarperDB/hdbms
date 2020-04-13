import React from 'react';

import CardBackLogin from './cardBackLogin';
import CardBackDelete from './cardBackDelete';

const CardBack = (params) => (params.flipState === 'login' ? <CardBackLogin {...params} /> : <CardBackDelete {...params} />);

export default CardBack;
