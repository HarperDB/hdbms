import React from 'react';
import { useStoreState } from 'pullstate';

import appState from '../../../state/appState';

import InstanceCard from './instanceCard';

import filterInstances from '../../../methods/instances/filterInstances';

const InstanceList = () => {
  const { instances, filterSearch, filterCloud, filterLocal } = useStoreState(appState, (s) => ({
    instances: s.instances,
    filterSearch: s.filterSearch,
    filterCloud: s.filterCloud,
    filterLocal: s.filterLocal,
  }));

  return filterInstances({
    filterSearch,
    filterCloud,
    filterLocal,
    instances,
  }).map((i) => <InstanceCard key={i.compute_stack_id} {...i} />);
};

export default InstanceList;
