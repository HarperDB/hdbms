import React, { useEffect } from 'react';
import { Row } from '@nio/ui-kit';
import { Redirect, useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import config from '../../../config';
import appState from '../../state/appState';

import InstanceList from './list/instanceList';
import NewInstanceCard from './list/newInstanceCard';
import NoInstancesCard from './list/noInstancesCard';
import SubNav from './subnav';
import NewInstanceModal from './new';
import AuthStateLoader from '../shared/authStateLoader';

const InstancesIndex = () => {
  const { action, customer_id } = useParams();
  const alert = useAlert();
  const instances = useStoreState(appState, (s) => s.instances);
  const isOrgUser = useStoreState(appState, (s) => s.auth?.orgs?.find((o) => o.customer_id?.toString() === customer_id), [customer_id]);
  const isOrgOwner = isOrgUser?.status === 'owner';

  useEffect(() => {
    if (isOrgOwner && window.userGuiding && instances && !instances.length) {
      window.userGuiding.previewGuide(config.user_guide_id, { checkHistory: true });
    }
  }, []);

  useEffect(() => {
    if (!isOrgUser) {
      alert.error('You have been removed from that organization');
    }
  }, [isOrgUser]);

  useEffect(() => {
    appState.update((s) => {
      s.lastUpdate = Date.now();
    });
  }, [customer_id]);

  return !instances ? (
    <div id="login-form">
      <AuthStateLoader header="loading instances" spinner />
    </div>
  ) : isOrgUser ? (
    <div id="instances">
      <SubNav />
      <Row>
        {isOrgOwner ? <NewInstanceCard /> : !instances?.length ? <NoInstancesCard /> : null}
        <InstanceList />
      </Row>
      {action === 'new' && instances && <NewInstanceModal />}
    </div>
  ) : (
    <Redirect to="/organizations" />
  );
};

export default InstancesIndex;
