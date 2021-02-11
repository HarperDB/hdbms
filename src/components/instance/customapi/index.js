import React, { useState, useEffect, useCallback } from 'react';
import { useStoreState } from 'pullstate';

import instanceState from '../../../functions/state/instanceState';

import Setup from './setup';
import Manage from './manage';
import Loader from '../../shared/Loader';
import buildCustomAPI from '../../../functions/instance/buildCustomAPI';

const ClusteringIndex = () => {
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const compute_stack_id = useStoreState(instanceState, (s) => s.compute_stack_id);
  const custom_api = useStoreState(instanceState, (s) => s.custom_api);
  const [showManage, setShowManage] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshApi = useCallback(async () => {
    if (auth && url) {
      setLoading(true);
      await buildCustomAPI({ auth, url });
      setLoading(false);
    }
  }, [auth, url, compute_stack_id]);

  useEffect(refreshApi, [refreshApi]);

  useEffect(() => {
    if (custom_api) {
      setShowManage(!!custom_api.is_enabled && !!custom_api.custom_api_user && !!custom_api.custom_api_role && !!custom_api.custom_api_port);
      setLoading(false);
    }
  }, [custom_api]);

  return !custom_api ? (
    <Loader header="loading custom api" spinner />
  ) : showManage ? (
    <Manage refreshApi={refreshApi} loading={loading} setLoading={setLoading} />
  ) : (
    <Setup refreshApi={refreshApi} loading={loading} setLoading={setLoading} />
  );
};

export default ClusteringIndex;
