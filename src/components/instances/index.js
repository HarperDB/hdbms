import React from 'react';
import { Row } from '@nio/ui-kit';

import TopNav from '../topnav';
import useLMS from '../../stores/lmsData';
import useInstanceAuth from '../../stores/instanceAuths';
import InstanceCard from './instanceCard';
import NewInstanceCard from './newInstanceCard';

export default () => {
  const [lmsData] = useLMS({ auth: false, instances: [] });
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});

  return (
    <>
      <TopNav />
      <Row>
        <NewInstanceCard />
        {lmsData.instances.map((i) => (
          <InstanceCard key={i.id} {...i} hasAuth={instanceAuths[i.id] && instanceAuths[i.id].user && instanceAuths[i.id].pass} setAuth={({ id, user, pass }) => setInstanceAuths({ ...instanceAuths, [id]: { user, pass } })} />
        ))}
      </Row>
    </>
  );
};
