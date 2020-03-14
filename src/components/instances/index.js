import React, { useState, useEffect } from 'react';
import { Row } from '@nio/ui-kit';
import useInterval from 'use-interval';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import appState from '../../state/stores/appState';
import useLMS from '../../state/stores/lmsAuth';
import defaultLMSAuth from '../../state/defaults/defaultLMSAuth';

import InstanceCard from './list/instanceCard';
import NewInstanceCard from './list/newInstanceCard';
import SubNav from '../navs/subnav';
import NewInstanceModal from './new';

import getInstances from '../../api/lms/getInstances';
import getLicenses from '../../api/lms/getLicenses';
import filterInstances from '../../util/filterInstances';
import getCustomer from '../../api/lms/getCustomer';
import getProducts from '../../api/lms/getProducts';
import getRegions from '../../api/lms/getRegions';

export default () => {
  const [lmsAuth] = useLMS(defaultLMSAuth);
  const { action } = useParams();
  const [filters, setFilters] = useState({ search: '', local: true, cloud: true });
  const [filteredInstances, setFilteredInstances] = useState([]);
  const { instances, products, regions, licenses, lastUpdate } = useStoreState(appState, (s) => ({
    products: s.products,
    regions: s.regions,
    licenses: s.licenses,
    instances: s.instances,
    lastUpdate: s.lastUpdate,
  }));

  useEffect(() => {
    if (instances) {
      const newFilteredInstances = filterInstances({ filters, instances });
      setFilteredInstances(newFilteredInstances);
    }
  }, [filters, instances]);

  useEffect(() => {
    getProducts();
    getRegions();
    getCustomer({ auth: lmsAuth, payload: { customer_id: lmsAuth.customer_id } });
    getLicenses({ auth: lmsAuth, payload: { customer_id: lmsAuth.customer_id } });
  }, []);

  useEffect(() => {
    if (products && regions && licenses) {
      getInstances({ auth: lmsAuth, payload: { customer_id: lmsAuth.customer_id }, entities: { products, regions, licenses } });
    }
  }, [products, regions, licenses, lastUpdate, action]);

  useInterval(() => { if (!action) appState.update((s) => { s.lastUpdate = Date.now(); }); }, 10000);

  return (
    <div id="instances">
      <SubNav
        filters={filters}
        setFilters={setFilters}
      />
      <Row>
        <NewInstanceCard />
        {filteredInstances.map((i) => (<InstanceCard key={i.compute_stack_id} {...i} />))}
      </Row>
      {action === 'new' && (<NewInstanceModal />)}
    </div>
  );
};
