import React from 'react';

import Setup from './setup';
import Manage from './manage';

export default ({ auth, structure, network, refreshInstance }) => (!network ? (
  <i className="fa fa-spinner fa-spin text-white" />
) : network.is_enabled && network.cluster_user && network.cluster_role ? (
  <Manage
    auth={auth}
    network={network}
    refreshInstance={refreshInstance}
    structure={structure}
  />
) : (
  <Setup
    auth={auth}
    network={network}
    refreshInstance={refreshInstance}
  />
));
