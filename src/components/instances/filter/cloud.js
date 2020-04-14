import React from 'react';
import { ToggleButton } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import appState from '../../../state/appState';

const updateFilter = (e) => {
  appState.update((s) => {
    s.filterCloud = e.target.checked;
  });
};

const icons = {
  checked: <div>cloud</div>,
  unchecked: <div>cloud</div>,
};

const Cloud = () => {
  const filterCloud = useStoreState(appState, (s) => s.filterCloud);

  return <ToggleButton width="100%" icons={icons} checked={filterCloud} onChange={updateFilter} />;
};

export default Cloud;