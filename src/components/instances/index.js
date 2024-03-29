import React, { useEffect, useState, useCallback } from 'react';
import { Row } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';
import useAsyncEffect from 'use-async-effect';
import useInterval from 'use-interval';

import config from '../../config';
import appState from '../../functions/state/appState';

import InstanceList from './list/InstanceList';
import NewInstanceCard from './list/NewInstanceCard';
import NoInstancesCard from './list/NoInstancesCard';
import SubNav from './SubNav';
import NewInstanceModal from './new';
import getInstances from '../../functions/api/lms/getInstances';
import Loader from '../shared/Loader';
import getCustomer from '../../functions/api/lms/getCustomer';
import getAlarms from '../../functions/api/lms/getAlarms';
import Unpaid from '../shared/Unpaid';
import UnlimitedEnterprise from '../shared/UnlimitedEnterprise';
import useInstanceAuth from '../../functions/state/instanceAuths';

function InstancesIndex() {
  const navigate = useNavigate();
  const { action, customer_id } = useParams();
  const alert = useAlert();
  const auth = useStoreState(appState, (s) => s.auth);
  const is_unpaid = useStoreState(appState, (s) => s.customer.is_unpaid || s.theme === 'akamai');
  const unlimited_local_install = useStoreState(appState, (s) => s.customer.unlimited_local_install);
  const products = useStoreState(appState, (s) => s.products);
  const regions = useStoreState(appState, (s) => s.regions);
  const subscriptions = useStoreState(appState, (s) => s.subscriptions);
  const instances = useStoreState(appState, (s) => s.instances);
  const isOrgUser = useStoreState(appState, (s) => s.auth?.orgs?.find((o) => o.customer_id?.toString() === customer_id && o.status !== 'invited'), [customer_id]);
  const isOrgOwner = isOrgUser?.status === 'owner';
  const [mounted, setMounted] = useState(false);
  const [instanceAuths] = useInstanceAuth({});

  useEffect(() => {
    if (action === 'login') {
      alert.error('Please log in to that instance');
    }
  }, [action, alert, instances, isOrgOwner]);

  useEffect(() => {
    if (auth && customer_id) {
      getCustomer({ auth, customer_id });
    }
  }, [customer_id, auth]);

  useEffect(() => {
    if (auth && customer_id) {
      getAlarms({ auth, customer_id });
    }
  }, [customer_id, instances, auth]);

  const refreshInstances = useCallback(() => {
    if (auth && products && regions && subscriptions && customer_id && instanceAuths) {
      getInstances({ auth, customer_id, products, regions, subscriptions, instanceCount: instances?.length });
    }
  }, [auth, customer_id, instances, products, regions, subscriptions, instanceAuths]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    refreshInstances();
  }, [auth, products, regions, subscriptions, customer_id, instanceAuths, refreshInstances]);

  useInterval(
    () => instances?.length && instances.some((i) => ['CREATE_IN_PROGRESS', 'UPDATE_IN_PROGRESS', 'CONFIGURING_NETWORK'].includes(i.status)) && refreshInstances(),
    config.refresh_content_interval,
  );

  useEffect(() => {
    if (mounted && instances && isOrgOwner) {
      alert.success('You have been made an owner of this organization');
    } else if (mounted && instances && !isOrgUser) {
      alert.error('You have been removed from this organization');
      navigate('/');
    } else if (mounted && instances) {
      alert.success('You are no longer an owner of this organization');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOrgOwner, isOrgUser?.status]);

  useAsyncEffect(
    () => setMounted(true),
    () => setMounted(false),
    [],
  );

  return (
    <div id="instances">
      <SubNav refreshInstances={refreshInstances} />
      {isOrgUser && instances ? (
        <>
          {unlimited_local_install && <UnlimitedEnterprise />}
          {is_unpaid && <Unpaid />}
          <Row>
            {isOrgOwner ? <NewInstanceCard /> : !instances?.length ? <NoInstancesCard /> : null}
            <InstanceList />
          </Row>
          {action === 'new' && instances && <NewInstanceModal />}
        </>
      ) : (
        <Loader header="loading instances" spinner />
      )}
    </div>
  );
}

export default InstancesIndex;
