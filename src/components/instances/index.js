import React, { useState, useEffect } from 'react';
import { Row } from '@nio/ui-kit';
import useInterval from 'use-interval';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import appState from '../../state/stores/appState';

import InstanceCard from './list/instanceCard';
import NewInstanceCard from './list/newInstanceCard';
import SubNav from '../navs/subnav';
import NewInstanceModal from './new';

import filterInstances from '../../util/filterInstances';

export default () => {
  const { action } = useParams();
  const [filters, setFilters] = useState({ search: '', local: true, cloud: true });
  const [filteredInstances, setFilteredInstances] = useState([]);
  const instances = useStoreState(appState, (s) => s.instances);

  useEffect(() => {
    if (instances) {
      const newFilteredInstances = filterInstances({ filters, instances });
      setFilteredInstances(newFilteredInstances);
    }
  }, [filters, instances]);

  useInterval(() => { if (!action) appState.update((s) => { s.lastUpdate = Date.now(); }); }, 5000);

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
