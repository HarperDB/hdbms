import React, { useState, useEffect } from 'react';
import { useStoreState } from 'pullstate';

import instanceState from '../../state/instanceState';

export default ({ label = 'instance' }) => {
  const [loading, setLoading] = useState(false);
  const structure = useStoreState(instanceState, (s) => s.structure);

  const refresh = async () => {
    setLoading(true);
    instanceState.update((s) => {
      s.lastUpdate = Date.now();
    });
  };

  useEffect(() => setLoading(false), [structure]);

  return (
    <a className="structure-reloader" onClick={refresh}>
      <i title="Refresh Structure" className={`fa mr-2 ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`} />
      {label}
    </a>
  );
};
