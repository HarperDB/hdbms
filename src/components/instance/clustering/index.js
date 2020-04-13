import React, { useMemo } from 'react';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';

import instanceState from '../../../state/instanceState';

import Setup from './setup';
import Manage from './manage';

export default () => {
  const { compute_stack_id } = useParams();
  const network = useStoreState(instanceState, (s) => s.network, [compute_stack_id]);
  const showManage = useMemo(() => !!network.is_enabled && !!network.cluster_user && !!network.cluster_role && network.name === compute_stack_id, [
    network.is_enabled,
    network.cluster_user,
    network.cluster_role,
    compute_stack_id,
  ]);

  console.log('network', !!network);
  console.log('is_enabled', !!network.is_enabled);
  console.log('cluster_user', !!network.cluster_user);
  console.log('cluster_role', !!network.cluster_role);
  console.log('node_name', network.name === compute_stack_id);

  return !network ? <i className="fa fa-spinner fa-spin text-white" /> : showManage ? <Manage /> : <Setup />;
};
