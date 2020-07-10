import React, { useEffect } from 'react';
import { Row } from '@nio/ui-kit';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import { ErrorBoundary } from 'react-error-boundary';
import appState from '../../state/appState';

import SubNav from './subnav';
import OrgList from './list/orgList';
import NewOrgCard from './list/newOrgCard';
import NewOrgModal from './new';
import Loader from '../shared/loader';
import addError from '../../api/lms/addError';
import ErrorFallbackCard from '../shared/errorFallbackCard';

const OrganizationsIndex = () => {
  const { action } = useParams();
  const auth = useStoreState(appState, (s) => s.auth);

  useEffect(() =>
    appState.update((s) => {
      s.users = false;
      s.instances = false;
      s.hasCard = false;
      s.lastUpdate = false;
    })
  );

  return (
    <div id="organizations">
      <SubNav />
      {auth?.orgs ? (
        <Row>
          <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack } })} FallbackComponent={ErrorFallbackCard}>
            <NewOrgCard />
          </ErrorBoundary>
          <OrgList />
        </Row>
      ) : (
        <Loader header="loading organizations" spinner />
      )}
      {action === 'new' && <NewOrgModal />}
    </div>
  );
};

export default OrganizationsIndex;
