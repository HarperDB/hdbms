import React from 'react';

import CardBackLogin from './CardBackLogin';
import CardBackDelete from './CardBackDelete';

const CardBack = (params) => (params.flipState === 'login' ? <CardBackLogin {...params} /> : <CardBackDelete {...params} />);

export default CardBack;
