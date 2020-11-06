import React from 'react';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';

import instanceState from '../../../functions/state/instanceState';

import Setup from './setup';
import Manage from './manage';

const ClusteringIndex = () => {
  const { compute_stack_id } = useParams();
  const network = useStoreState(instanceState, (s) => s.network, [compute_stack_id]);
  const showManage = network && !!network.is_enabled && !!network.cluster_user && !!network.cluster_role && network.name === compute_stack_id;

  return !network ? <i className="fa fa-spinner fa-spin text-white" /> : showManage ? <Manage /> : <Setup />;
};

export default ClusteringIndex;
