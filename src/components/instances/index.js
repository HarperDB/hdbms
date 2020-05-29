import React, { useEffect } from 'react';
import { Row } from '@nio/ui-kit';

import { Redirect, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import config from '../../../config';
import appState from '../../state/appState';

import InstanceList from './list/instanceList';
import NewInstanceCard from './list/newInstanceCard';
import NoInstancesCard from './list/noInstancesCard';
import SubNav from './subnav';
import NewInstanceModal from './new';

const InstancesIndex = () => {
  const { action } = useParams();
  const { instances, isOrgUser, isOrgOwner } = useStoreState(appState, (s) => {
    const userExists = s.auth.orgs.find((o) => o.customer_id === s.customer?.customer_id);
    return {
      auth: s.auth,
      products: s.products,
      customer_id: s.customer?.customer_id,
      regions: s.regions,
      lastUpdate: s.lastUpdate,
      instances: s.instances,
      isOrgUser: userExists,
      isOrgOwner: userExists?.status === 'owner',
    };
  });

  useEffect(() => {
    if (isOrgOwner) {
      window.userGuiding.previewGuide(config.user_guide_id, { checkHistory: true });
    } else {
      console.log('you are not the mama!');
    }
  }, []);

  return isOrgUser ? (
    <div id="instances">
      <SubNav />
      <Row>
        {isOrgOwner && <NewInstanceCard />}
        {!isOrgOwner && !instances?.length && <NoInstancesCard />}
        <InstanceList />
      </Row>
      {action === 'new' && instances && <NewInstanceModal />}
    </div>
  ) : (
    <Redirect to="/organizations" />
  );
};

export default InstancesIndex;
