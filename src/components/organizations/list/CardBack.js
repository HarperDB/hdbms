import React from 'react';

import CardBackLeave from './CardBackLeave';
import CardBackDelete from './CardBackDelete';

const CardBack = (params) => (params.flipState === 'leave' ? <CardBackLeave {...params} /> : <CardBackDelete {...params} />);

export default CardBack;
