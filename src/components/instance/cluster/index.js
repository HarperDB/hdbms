import React, { useState, useEffect, useCallback } from 'react';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';

import appState from '../../../functions/state/appState';
import instanceState from '../../../functions/state/instanceState';
import buildNetwork from '../../../functions/instance/buildNetwork';

import Setup from './setup';
import Manage from './manage';
import Loader from '../../shared/loader';

const ClusteringIndex = () => {
  const instances = useStoreState(appState, (s) => s.instances);
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const compute_stack_id = useStoreState(instanceState, (s) => s.compute_stack_id);
  const network = useStoreState(instanceState, (s) => s.network);
  const connectedNodes = useStoreState(instanceState, (s) => s.clustering?.connected);
  const aNodeIsConnecting = connectedNodes?.some((c) => c.connection.state === 'connecting');
  const [showManage, setShowManage] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshNetwork = useCallback(async () => {
    if (auth && url && instances && compute_stack_id) {
      setLoading(true);
      await buildNetwork({ auth, url, instances, compute_stack_id });
      setLoading(false);
    }
  }, [auth, url, instances, compute_stack_id]);

  useEffect(refreshNetwork, [refreshNetwork]);

  useEffect(() => {
    if (network) {
      setShowManage(!!network.is_enabled && !!network.cluster_user && !!network.cluster_role);
      setLoading(false);
    }
  }, [network]);

  useInterval(() => {
    if (aNodeIsConnecting) {
      refreshNetwork();
    }
  }, 1000);

  return !network ? (
    <Loader header="loading network" spinner />
  ) : showManage ? (
    <Manage refreshNetwork={refreshNetwork} loading={loading || (connectedNodes.length === 1 && aNodeIsConnecting)} setLoading={setLoading} />
  ) : (
    <Setup refreshNetwork={refreshNetwork} loading={loading} setLoading={setLoading} />
  );
};

export default ClusteringIndex;
