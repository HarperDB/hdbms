import React, { useState } from 'react';
import { useStoreState } from 'pullstate';
import appState from '../../../functions/state/appState';
import InstanceCard from './InstanceCard';
import filterInstances from '../../../functions/instances/filterInstances';
const InstanceList = () => {
  const [flippedCard, setFlippedCard] = useState(false);
  const instances = useStoreState(appState, s => filterInstances({
    filterSearch: s.filterSearch,
    filterCloud: s.filterCloud,
    filterLocal: s.filterLocal,
    instances: s.instances
  }));
  return instances.filter(instance => {
    const {
      wavelengthZoneId,
      status
    } = instance;
    const deletedWavelengthInstance = wavelengthZoneId && status === 'DELETE_FAILED';
    if (deletedWavelengthInstance) {
      return false;
    }
    return true;
  }).map(i => <InstanceCard key={i.computeStackId} {...i} flippedCard={flippedCard} setFlippedCard={setFlippedCard} />);
};
export default InstanceList;