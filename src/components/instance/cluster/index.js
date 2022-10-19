import React, { useState, useEffect, useCallback } from 'react';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';
import { useParams } from 'react-router-dom';

import appState from '../../../functions/state/appState';
import instanceState from '../../../functions/state/instanceState';
import buildNetwork from '../../../functions/instance/buildNetwork';

import Setup from './setup';
import Manage from './manage';
import Loader from '../../shared/Loader';
import EmptyPrompt from '../../shared/EmptyPrompt';
import useInstanceAuth from '../../../functions/state/instanceAuths';

function ClusteringIndex() {
  const { customer_id } = useParams();
  const instances = useStoreState(appState, (s) => s.instances);
  const getInstancesParams = useStoreState(appState, (s) => ({ appAuth: s.auth, products: s.products, regions: s.regions, subscriptions: s.subscriptions }));
  const [instanceAuths] = useInstanceAuth({});
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const compute_stack_id = useStoreState(instanceState, (s) => s.compute_stack_id);
  const network = useStoreState(instanceState, (s) => s.network);
  const connectedNodes = useStoreState(instanceState, (s) => s.clusterPartners?.connected);
  const aNodeIsConnecting = connectedNodes?.some((c) => c.connection.state === 'connecting');
  const name = useStoreState(instanceState, (s) => s.network?.name, [compute_stack_id]);
  const restarting = useStoreState(instanceState, (s) => s.restarting);
  const nodeNameMatch = compute_stack_id === name;
  const [showManage, setShowManage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [configuring, setConfiguring] = useState(false);

  const refreshNetwork = useCallback(
    async (loadId = true) => {
      if (auth && url && instances && compute_stack_id && !restarting) {
        setLoading(loadId);
        await buildNetwork({ ...getInstancesParams, auth, compute_stack_id, customer_id, instanceAuths, setLoading });
        setLoading(false);
      }
    },
    [auth, url, instances, compute_stack_id, restarting, getInstancesParams, customer_id, instanceAuths]
  );

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

  useInterval(() => {
    if (configuring) refreshNetwork();
  }, 2000);

  return !network ? (
    <Loader header="loading network" spinner />
  ) : configuring ? (
    <EmptyPrompt description="Configuring Clustering" icon={<i className="fa fa-spinner fa-spin" />} />
  ) : showManage ? (
    <Manage refreshNetwork={refreshNetwork} loading={loading || (connectedNodes.length === 1 && aNodeIsConnecting)} setLoading={setLoading} />
  ) : (
    <Setup refreshNetwork={refreshNetwork} loading={loading} setLoading={setLoading} setConfiguring={setConfiguring} />
  );
}

export default ClusteringIndex;
