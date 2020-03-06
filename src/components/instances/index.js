import React, { useState } from 'react';
import { Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import useInstanceAuth from '../../state/stores/instanceAuths';
import useApp from '../../state/stores/appData';
import useLMS from '../../state/stores/lmsAuth';

import defaultAppData from '../../state/defaults/defaultAppData';
import defaultLMSAuth from '../../state/defaults/defaultLMSAuth';

import InstanceCard from './list/instanceCard';
import NewInstanceCard from './list/newInstanceCard';
import SubNav from '../navs/subnav';

import getInstances from '../../api/lms/getInstances';
import getLicenses from '../../api/lms/getLicenses';
import filterInstances from '../../util/filterInstances';
import getCustomer from '../../api/lms/getCustomer';
import getProducts from '../../api/lms/getProducts';
import getRegions from '../../api/lms/getRegions';

export default () => {
  const [lmsAuth] = useLMS(defaultLMSAuth);
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});
  const [appData, setAppData] = useApp(defaultAppData);
  const [products, setProducts] = useState(false);
  const [regions, setRegions] = useState(false);
  const [customer, setCustomer] = useState(false);
  const [licenses, setLicenses] = useState(false);
  const [search, setSearch] = useState('');
  const [local, setLocal] = useState(true);
  const [cloud, setCloud] = useState(true);
  const [filteredInstances, setFilteredInstances] = useState(false);

  useAsyncEffect(() => {
    const newFilteredInstances = filterInstances({ local, cloud, search, instances: appData.instances });
    setFilteredInstances(newFilteredInstances);
  }, [search, local, cloud, appData.instances]);

  useAsyncEffect(async () => setProducts(await getProducts()), []);
  useAsyncEffect(async () => setRegions(await getRegions()), []);
  useAsyncEffect(async () => setCustomer(await getCustomer({ auth: lmsAuth, payload: { customer_id: appData.user.customer_id } })), []);
  useAsyncEffect(async () => setLicenses(await getLicenses({ auth: lmsAuth, payload: { customer_id: appData.user.customer_id } })), []);

  useAsyncEffect(async () => {
    if (products && regions && licenses && customer) {
      const instances = await getInstances({ auth: lmsAuth, products, regions, licenses });
      setAppData({ ...appData, products, regions, licenses, customer, instances });
    }
  }, [products, regions, licenses, customer]);

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
            key={i.id}
            {...i}
            hasAuth={instanceAuths && instanceAuths[i.id]}
            setAuth={({ id, user, pass }) => setInstanceAuths({ ...instanceAuths, [id]: user && pass ? { user, pass } : false })}
          />
        )) : null}
      </Row>
    </div>
  );
};
