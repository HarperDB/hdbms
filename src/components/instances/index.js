import React, { useState } from 'react';
import { Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import useInterval from 'use-interval';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import useApp from '../../state/stores/appData';
import useLMS from '../../state/stores/lmsAuth';
import appState from '../../state/stores/appState';

import defaultAppData from '../../state/defaults/defaultAppData';
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
  const [appData, setAppData] = useApp(defaultAppData);
  const { action } = useParams();
  const [products, setProducts] = useState(false);
  const [regions, setRegions] = useState(false);
  const [customer, setCustomer] = useState(false);
  const [licenses, setLicenses] = useState(false);
  const [search, setSearch] = useState('');
  const [local, setLocal] = useState(true);
  const [cloud, setCloud] = useState(true);
  const [filteredInstances, setFilteredInstances] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(false);
  // const currentState = useStoreState(appState);

  useAsyncEffect(() => {
    if (appData.instances) {
      const newFilteredInstances = filterInstances({ local, cloud, search, instances: appData.instances });
      setFilteredInstances(newFilteredInstances);
    }
  }, [search, local, cloud, appData.instances]);

  useAsyncEffect(async () => setProducts(await getProducts()), []);
  useAsyncEffect(async () => setRegions(await getRegions()), []);
  useAsyncEffect(async () => setCustomer(await getCustomer({ auth: lmsAuth, payload: { customer_id: lmsAuth.customer_id } })), []);
  useAsyncEffect(async () => setLicenses(await getLicenses({ auth: lmsAuth, payload: { customer_id: lmsAuth.customer_id } })), []);

  useAsyncEffect(async () => {
    if (products && regions && licenses && customer && !action) {
      const instances = await getInstances({ auth: lmsAuth, payload: { customer_id: lmsAuth.customer_id }, entities: { products, regions, licenses } });
      setAppData({ ...appData, products, regions, licenses, customer, instances });
    }
  }, [products, regions, licenses, customer, lastUpdate, action]);

  useInterval(() => setLastUpdate(Date.now()), 10000);

  return (
    <div id="instances">
      <SubNav
        search={search}
        setSearch={setSearch}
        local={local}
        setLocal={setLocal}
        cloud={cloud}
        setCloud={setCloud}
      />
      <Row>
        <NewInstanceCard />
        {filteredInstances ? filteredInstances.map((i) => (
          <InstanceCard
            key={i.compute_stack_id}
            {...i}
          />
        )) : null}
      </Row>
      {action === 'new' && (<NewInstanceModal />)}
    </div>
  );
};
