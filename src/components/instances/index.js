import React from 'react';
import { Row } from '@nio/ui-kit';
import useInterval from 'use-interval';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import config from '../../../config';
import appState from '../../state/appState';

import InstanceList from './list/instanceList';
import NewInstanceCard from './list/newInstanceCard';
import NoInstancesCard from './list/noInstancesCard';
import SubNav from './subnav';
import NewInstanceModal from './new';
import getInstances from '../../api/lms/getInstances';

const InstancesIndex = () => {
  const { action } = useParams();
  const { auth, products, regions, instances, customer_id } = useStoreState(appState, (s) => ({
    auth: s.auth,
    products: s.products,
    customer_id: s.customer?.customer_id,
    regions: s.regions,
    lastUpdate: s.lastUpdate,
    instances: s.instances,
  }));
  const isOrgOwner = auth?.orgs?.find((o) => o.customer_id === customer_id)?.status === 'owner';

  useInterval(() => {
    if (!action)
      getInstances({
        auth,
        customer_id,
        products,
        regions,
        instanceCount: instances?.length,
      });
  }, config.instances_refresh_rate);

  return (
    <div id="instances">
      <SubNav />
      <Row>
        {isOrgOwner && <NewInstanceCard />}
        {!isOrgOwner && !instances?.length && <NoInstancesCard />}
        <InstanceList />
      </Row>
      {action === 'new' && instances && <NewInstanceModal />}
    </div>
  );
};

export default InstancesIndex;
