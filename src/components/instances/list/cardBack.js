import React from 'react';

import CardBackLogin from './cardBackLogin';
import CardBackDelete from './cardBackDelete';

export default (params) => (params.flipState === 'login' ? <CardBackLogin {...params} /> : <CardBackDelete {...params} />);
