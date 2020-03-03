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
  const [search, setSearch] = useState('');
  const [local, setLocal] = useState(true);
  const [cloud, setCloud] = useState(true);
  const [filteredInstances, setFilteredInstances] = useState([]);

  useAsyncEffect(() => {
    setFilteredInstances(filterInstances({ local, cloud, search, instances: appData.instances }));
  }, [search, local, cloud, appData.instances]);

  useAsyncEffect(async () => {
    const products = await getProducts();
    const regions = await getRegions();
    const customer = await getCustomer({ auth: lmsAuth });
    const licenses = await getLicenses({ auth: lmsAuth });
    const instances = await getInstances({ auth: lmsAuth, products, regions, licenses });
    setAppData({ ...appData, customer, products, regions, instances, licenses });
  }, []);

  return (
    <>
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
        {filteredInstances?.map((i) => (
          <InstanceCard
            key={i.id}
            {...i}
            hasAuth={instanceAuths && instanceAuths[i.id]}
            setAuth={({ id, user, pass }) => setInstanceAuths({ ...instanceAuths, [id]: user && pass ? { user, pass } : false })}
          />
        ))}
      </Row>
    </>
  );
};
