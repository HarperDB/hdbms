import React from 'react';
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

export default () => {
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});
  const [lmsData, setLMSData] = useLMS(defaultLMSData);

  useAsyncEffect(async () => {
    const instances = await getInstances({ auth: lmsData.auth });
    const licenses = await getLicenses({ auth: lmsData.auth });
    const products = await getProducts({ auth: lmsData.auth });
    setLMSData({ ...lmsData, instances, licenses, products });
  }, []);

  return (
    <Row>
      <NewInstanceCard />
      {lmsData.instances.map((i) => (
        <InstanceCard
          key={i.id}
          {...i}
          hasAuth={instanceAuths[i.id]}
          setAuth={({ id, user, pass }) => setInstanceAuths({ ...instanceAuths, [id]: user && pass ? { user, pass } : false })}
        />
      ))}
    </Row>
  );
};
