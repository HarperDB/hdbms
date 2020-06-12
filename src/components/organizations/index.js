import React from 'react';
import { Row } from '@nio/ui-kit';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import appState from '../../state/appState';

import SubNav from './subnav';
import OrgList from './list/orgList';
import NewOrgCard from './list/newOrgCard';
import NewOrgModal from './new';
import Loader from '../shared/loader';

const OrganizationsIndex = () => {
  const { action } = useParams();
  const auth = useStoreState(appState, (s) => s.auth);

  return (
    <div id="organizations">
      <SubNav />
      {auth?.orgs ? (
        <Row>
          <NewOrgCard />
          <OrgList />
        </Row>
      ) : (
        <Loader message="loading organizations" />
      )}
      {action === 'new' && <NewOrgModal />}
    </div>
  );
};

export default OrganizationsIndex;
