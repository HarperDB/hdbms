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
  const { action, customer_id } = useParams();
  const instances = useStoreState(appState, (s) => s.instances);
  const isOrgUser = useStoreState(appState, (s) => s.auth?.orgs?.find((o) => o.customer_id.toString() === customer_id), [customer_id]);
  const isOrgOwner = isOrgUser?.status === 'owner';

  useEffect(() => {
    if (isOrgOwner && window.userGuiding && instances && !instances.length) {
      window.userGuiding.previewGuide(config.user_guide_id, { checkHistory: true });
    }
    appState.update((s) => {
      s.lastUpdate = Date.now();
    });
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
