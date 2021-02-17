import React, { useState, useEffect, useCallback } from 'react';
import { useStoreState } from 'pullstate';

import instanceState from '../../../functions/state/instanceState';

import Setup from './setup';
import Manage from './manage';
import Loader from '../../shared/Loader';
import buildCustomFunctions from '../../../functions/instance/buildCustomFunctions';

const ClusteringIndex = () => {
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const compute_stack_id = useStoreState(instanceState, (s) => s.compute_stack_id);
  const custom_functions = useStoreState(instanceState, (s) => s.custom_functions);
  const [showManage, setShowManage] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshApi = useCallback(async () => {
    if (auth && url) {
      setLoading(true);
      await buildCustomFunctions({ auth, url });
      setLoading(false);
    }
  }, [auth, url, compute_stack_id]);

  useEffect(refreshApi, [refreshApi]);

  useEffect(() => {
    if (custom_functions) {
      setShowManage(!!custom_functions.is_enabled && !!custom_functions.port);
      setLoading(false);
    }
  }, [custom_functions]);

  return !custom_functions ? (
    <Loader header="loading custom api" spinner />
  ) : showManage ? (
    <Manage refreshApi={refreshApi} loading={loading} setLoading={setLoading} />
  ) : (
    <Setup refreshApi={refreshApi} loading={loading} setLoading={setLoading} />
  );
};

export default ClusteringIndex;
