import React, { useState } from 'react';
import { Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import useInstanceAuth from '../../state/instanceAuths';
import InstanceCard from './list/instanceCard';
import NewInstanceCard from './list/newInstanceCard';
import useLMS from '../../state/lmsData';
import defaultLMSData from '../../state/defaults/defaultLMSData';
import getInstances from '../../api/lms/getInstances';
import getLicenses from '../../api/lms/getLicenses';
import getProducts from '../../api/lms/getProducts';
import filterInstances from '../../util/filterInstances';
import SubNav from '../shared/subnav';

export default () => {
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});
  const [lmsData, setLMSData] = useLMS(defaultLMSData);
  const [search, setSearch] = useState('');
  const [local, setLocal] = useState(true);
  const [cloud, setCloud] = useState(true);
  const [filteredInstances, setFilteredInstances] = useState([]);

  useAsyncEffect(async () => {
    const instances = await getInstances({ auth: lmsData.auth });
    const licenses = await getLicenses({ auth: lmsData.auth });
    const products = await getProducts({ auth: lmsData.auth });
    setLMSData({ ...lmsData, instances, licenses, products });
  }, []);

  useAsyncEffect(() => {
    if (lmsData.instances.length) {
      setFilteredInstances(filterInstances({ local, cloud, search, instances: lmsData.instances }));
    }
  }, [search, local, cloud, lmsData.instances]);

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
        {filteredInstances.map((i) => (
          <InstanceCard
            key={i.id}
            {...i}
            hasAuth={instanceAuths[i.id]}
            setAuth={({ id, user, pass }) => setInstanceAuths({ ...instanceAuths, [id]: user && pass ? { user, pass } : false })}
          />
        ))}
      </Row>
    </>
  );
};
