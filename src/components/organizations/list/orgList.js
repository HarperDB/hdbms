import React, { useState } from 'react';
import { useStoreState } from 'pullstate';

import appState from '../../../state/appState';
import OrgCard from './orgCard';
import filterOrgs from '../../../methods/organizations/filterOrgs';

const OrgList = () => {
  const [flippedCard, setFlippedCard] = useState(false);
  const orgs = useStoreState(appState, (s) => filterOrgs({ orgSearch: s.orgSearch, orgs: s.auth.orgs }));

  return orgs.map((org) => <OrgCard key={org.customer_id} {...org} flippedCard={flippedCard} setFlippedCard={setFlippedCard} />);
};

export default OrgList;
