import React, { useState } from 'react';
import { Row } from '@nio/ui-kit';
import useInterval from 'use-interval';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import appState from '../../state/stores/appState';

import InstanceCard from './list/instanceCard';
import NewInstanceCard from './list/newInstanceCard';
import SubNav from './subnav';
import NewInstanceModal from './new';

import filterInstances from '../../util/instance/filterInstances';

export default () => {
  const { action } = useParams();
  const [filters, setFilters] = useState({ search: '', local: true, cloud: true });
  const instances = useStoreState(appState, (s) => s.instances);

  useInterval(() => { if (!action) appState.update((s) => { s.lastUpdate = Date.now(); }); }, 10000);

  return (
    <div id="instances">
      <SubNav
        filters={filters}
        setFilters={setFilters}
      />
      <Row>
        <NewInstanceCard />
        {filterInstances({ filters, instances }).map((i) => (<InstanceCard key={i.compute_stack_id} {...i} />))}
      </Row>
      {action === 'new' && (<NewInstanceModal />)}
    </div>
  );
};
