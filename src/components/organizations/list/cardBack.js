import React from 'react';

import CardBackLeave from './cardBackLeave';
import CardBackDelete from './cardBackDelete';

const CardBack = (params) => (params.flipState === 'leave' ? <CardBackLeave {...params} /> : <CardBackDelete {...params} />);

export default CardBack;
