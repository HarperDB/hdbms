import React from 'react';
import { Row } from '@nio/ui-kit';
import useInterval from 'use-interval';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import config from '../../../config';
import appState from '../../state/appState';

import InstanceList from './list/instanceList';
import NewInstanceCard from './list/newInstanceCard';
import SubNav from './subnav';
import NewInstanceModal from './new';
import getInstances from '../../api/lms/getInstances';

const InstancesIndex = () => {
  const { action } = useParams();
  const { auth, products, regions, instances } = useStoreState(appState, (s) => ({
    auth: s.auth,
    products: s.products,
    regions: s.regions,
    lastUpdate: s.lastUpdate,
    instances: s.instances,
  }));

  useInterval(() => {
    if (!action)
      getInstances({
        auth,
        customer_id: auth?.customer_id,
        products,
        regions,
        instanceCount: instances?.length,
      });
  }, config.instances_refresh_rate);

  return (
    <div id="instances">
      <SubNav />
      <Row>
        <NewInstanceCard />
        <InstanceList />
      </Row>
      {action === 'new' && <NewInstanceModal />}
    </div>
  );
};

export default InstancesIndex;
