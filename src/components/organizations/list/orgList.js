import React, { useState } from 'react';
import { useStoreState } from 'pullstate';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../../../state/appState';
import OrgCard from './orgCard';
import filterOrgs from '../../../methods/organizations/filterOrgs';
import addError from '../../../api/lms/addError';
import ErrorFallbackCard from '../../shared/errorFallbackCard';

const OrgList = () => {
  const [flippedCard, setFlippedCard] = useState(false);
  const orgs = useStoreState(appState, (s) => filterOrgs({ orgSearch: s.orgSearch, orgs: s.auth.orgs }));

  return orgs.map((org) => (
    <ErrorBoundary key={org.customer_id} onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallbackCard}>
      <OrgCard {...org} flippedCard={flippedCard} setFlippedCard={setFlippedCard} />
    </ErrorBoundary>
  ));
};

export default OrgList;
