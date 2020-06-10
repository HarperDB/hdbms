import React from 'react';
import { Row } from '@nio/ui-kit';
import { useParams } from 'react-router-dom';

import SubNav from './subnav';
import OrgList from './list/orgList';
import NewOrgCard from './list/newOrgCard';
import NewOrgModal from './new';

const OrganizationsIndex = () => {
  const { action } = useParams();

  return (
    <div id="organizations">
      <SubNav />
      <Row>
        <NewOrgCard />
        <OrgList />
      </Row>
      {action === 'new' && <NewOrgModal />}
    </div>
  );
};

export default OrganizationsIndex;
