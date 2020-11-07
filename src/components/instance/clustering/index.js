import React, { useEffect } from 'react';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';

import instanceState from '../../../functions/state/instanceState';
import buildNetwork from '../../../functions/instance/buildNetwork';

import Setup from './setup';
import Manage from './manage';
import Loader from '../../shared/loader';

const ClusteringIndex = () => {
  const { compute_stack_id } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const instances = useStoreState(instanceState, (s) => s.instances);
  const structure = useStoreState(instanceState, (s) => s.structure);
  const network = useStoreState(instanceState, (s) => s.network, [compute_stack_id]);
  const showManage = network && !!network.is_enabled && !!network.cluster_user && !!network.cluster_role && network.name === compute_stack_id;

  useEffect(() => {
    if (auth && compute_stack_id && instances && structure && url) {
      buildNetwork({ auth, url, instances, compute_stack_id, structure });
    }
  }, [auth, compute_stack_id, instances, structure, url]);

  return !network ? <Loader header="loading network" spinner /> : showManage ? <Manage /> : <Setup />;
};

export default ClusteringIndex;
