import React from 'react';
import { Row } from '@nio/ui-kit';

import TopNav from './topnav';
import useInstanceAuth from '../stores/instanceAuths';
import InstanceCard from './instances/instanceCard';
import NewInstanceCard from './instances/newInstanceCard';

export default ({ lmsData }) => {
  const [instanceAuths, setInstanceAuths] = useInstanceAuth({});

  return (
    <>
      <TopNav />
      <Row>
        <NewInstanceCard lmsData={lmsData} />
        {lmsData.instances.map((i) => (
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
