import React from 'react';
import { useStoreState } from 'pullstate';

import instanceState from '../../state/instanceState';

export default ({ label = 'instance', centerText = false }) => {
  const loading = useStoreState(instanceState, (s) => s.loading);

  const refresh = () =>
    instanceState.update((s) => {
      s.lastUpdate = Date.now();
      s.loading = true;
    });

  return (
    <span className={`structure-reloader ${centerText ? 'd-block text-center' : ''}`}>
      <button type="button" onClick={refresh}>
        <i title="Refresh Structure" className={`fa mr-2 ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`} />
        {label}
      </button>
    </span>
  );
};
