import React, { useEffect } from 'react';
import { Row } from 'reactstrap';
import { useHistory, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import { ErrorBoundary } from 'react-error-boundary';
import appState from '../../functions/state/appState';

import SubNav from './subnav';
import OrgList from './list/orgList';
import NewOrgCard from './list/newOrgCard';
import NewOrgModal from './new';
import Loader from '../shared/loader';
import addError from '../../functions/api/lms/addError';
import ErrorFallbackCard from '../shared/errorFallbackCard';

const OrganizationsIndex = () => {
  const { list, action } = useParams();
  const history = useHistory();
  const auth = useStoreState(appState, (s) => s.auth);

  useEffect(() =>
    appState.update((s) => {
      s.users = false;
      s.instances = false;
      s.hasCard = false;
      s.lastUpdate = false;
    })
  );

  useEffect(() => {
    if (auth?.orgs?.length === 1 && !list) {
      history.push(`/o/${auth.orgs[0].customer_id}/instances`)
    }
  }, [auth]);

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
