import React, { useState } from 'react';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';
import useAsyncEffect from 'use-async-effect';

import appState from '../../../functions/state/appState';
import instanceState from '../../../functions/state/instanceState';
import buildNetwork from '../../../functions/instance/buildNetwork';

import Setup from './setup';
import Manage from './manage';
import Loader from '../../shared/loader';

const ClusteringIndex = () => {
  const { compute_stack_id } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const network = useStoreState(instanceState, (s) => s.network, [compute_stack_id]);
  const instances = useStoreState(appState, (s) => s.instances, [compute_stack_id]);
  const [showManage, setShowManage] = useState(false);
  const [loading, setLoading] = useState(true);

  useAsyncEffect(async () => {
    if (auth && compute_stack_id && instances && url) {
      setLoading(true);
      await buildNetwork({ auth, url, instances, compute_stack_id });
      setTimeout(() => setLoading(false), 100);
    }
  }, [url]);

  useAsyncEffect(() => {
    if (network) {
      setShowManage(!!network.is_enabled && !!network.cluster_user && !!network.cluster_role);
      setLoading(false);
    }
  }, [network]);

  return loading ? <Loader header="loading network" spinner /> : showManage ? <Manage /> : <Setup />;
};

export default ClusteringIndex;
