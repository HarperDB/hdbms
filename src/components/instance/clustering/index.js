import React from 'react';
import { useStoreState } from 'pullstate';

import instanceState from '../../../state/stores/instanceState';

import Setup from './setup';
import Manage from './manage';

export default () => {
  const network = useStoreState(instanceState, (s) => s.network);

  return !network ? (
    <i className="fa fa-spinner fa-spin text-white" />
  ) : network.is_enabled && network.cluster_user && network.cluster_role ? (
    <Manage />
  ) : (
    <Setup network={network} />
  );
};
