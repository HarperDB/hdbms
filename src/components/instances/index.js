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
  const {
    action,
    customerId
  } = useParams();
  const alert = useAlert();
  const auth = useStoreState(appState, s => s.auth);
  const isUnpaid = useStoreState(appState, s => s.customer.isUnpaid || s.theme === 'akamai');
  const unlimitedLocalInstall = useStoreState(appState, s => s.customer.unlimitedLocalInstall);
  const products = useStoreState(appState, s => s.products);
  const regions = useStoreState(appState, s => s.regions);
  const subscriptions = useStoreState(appState, s => s.subscriptions);
  const instances = useStoreState(appState, s => s.instances);
  const isOrgUser = useStoreState(appState, s => s.auth?.orgs?.find(o => o.customerId?.toString() === customerId && o.status !== 'invited'), [customerId]);
  const isOrgOwner = isOrgUser?.status === 'owner';
  const [mounted, setMounted] = useState(false);
  const [instanceAuths] = useInstanceAuth({});
  useEffect(() => {
    if (action === 'login') {
      alert.error('Please log in to that instance');
    }
  }, [action, alert, instances, isOrgOwner]);
  useEffect(() => {
    if (auth && customerId) {
      getCustomer({
        auth,
        customerId
      });
    }
  }, [customerId, auth]);
  useEffect(() => {
    if (auth && customerId) {
      getAlarms({
        auth,
        customerId
      });
    }
  }, [customerId, instances, auth]);
  const refreshInstances = useCallback(() => {
    if (auth && products && regions && subscriptions && customerId && instanceAuths) {
      getInstances({
        auth,
        customerId,
        products,
        regions,
        subscriptions,
        instanceCount: instances?.length
      });
    }
  }, [auth, customerId, instances, products, regions, subscriptions, instanceAuths]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    refreshInstances();
  }, [auth, products, regions, subscriptions, customerId, instanceAuths, refreshInstances]);
  useInterval(() => instances?.length && instances.some(i => ['CREATE_IN_PROGRESS', 'UPDATE_IN_PROGRESS', 'CONFIGURING_NETWORK'].includes(i.status)) && refreshInstances(), config.refreshContentInterval);
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
  useAsyncEffect(() => setMounted(true), () => setMounted(false), []);
  return <div id="instances">
      <SubNav refreshInstances={refreshInstances} />
      {isOrgUser && instances ? <>
          {unlimitedLocalInstall && <UnlimitedEnterprise />}
          {isUnpaid && <Unpaid />}
          <Row>
            {isOrgOwner ? <NewInstanceCard /> : !instances?.length ? <NoInstancesCard /> : null}
            <InstanceList />
          </Row>
          {action === 'new' && instances && <NewInstanceModal />}
        </> : <Loader header="loading instances" spinner />}
    </div>;
}
export default InstancesIndex;