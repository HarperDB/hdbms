import React, { useState, useEffect, useCallback } from 'react';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';

import appState from '../../../functions/state/appState';
import instanceState from '../../../functions/state/instanceState';
import buildNetwork from '../../../functions/instance/buildNetwork';

import Setup from './setup';
import Manage from './manage';
import Loader from '../../shared/Loader';
import EmptyPrompt from '../../shared/EmptyPrompt';
import useInstanceAuth from '../../../functions/state/instanceAuths';
import clusterStatus from '../../../functions/api/instance/clusterStatus';

function ClusteringIndex() {
  const instances = useStoreState(appState, (s) => s.instances);
  const [instanceAuths] = useInstanceAuth({});
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const compute_stack_id = useStoreState(instanceState, (s) => s.compute_stack_id);
  const network = useStoreState(instanceState, (s) => s.network);
  const name = useStoreState(instanceState, (s) => s.network?.name, [compute_stack_id]);
  const restarting = useStoreState(instanceState, (s) => s.restarting);
  const nodeNameMatch = compute_stack_id === name;
  const [showManage, setShowManage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [configuring, setConfiguring] = useState(false);

  const refreshNetwork = useCallback(async () => {
    if (auth && url && instances && compute_stack_id && !restarting) {
      await buildNetwork({ auth, url, instances, compute_stack_id, instanceAuths, setLoading });
    }
  }, [auth, url, instances, compute_stack_id, restarting, instanceAuths]);

  useEffect(refreshNetwork, [refreshNetwork]);

  useEffect(() => {
    if (network) {
      const isConfigured = !!network.is_enabled && !!network.cluster_user && !!network.cluster_role && !!nodeNameMatch;
      setShowManage(isConfigured);
      if (isConfigured) {
        setConfiguring(false);
      }
    }
  }, [network, nodeNameMatch]);

  useInterval(async () => {
    if (configuring) {
      const currentStatus = await clusterStatus({ auth, url });
      if (currentStatus?.is_enabled) {
        refreshNetwork();
      }
    }
  }, 2000);

  return configuring ? (
    <EmptyPrompt description="Configuring Clustering" icon={<i className="fa fa-spinner fa-spin" />} />
  ) : !network ? (
    <Loader header="loading network" spinner />
  ) : showManage ? (
    <Manage refreshNetwork={refreshNetwork} loading={loading} setLoading={setLoading} />
  ) : (
    <Setup setConfiguring={setConfiguring} />
  );
}

export default ClusteringIndex;
