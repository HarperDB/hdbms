import React from 'react';
import { Button } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import configureCluster from '../../../api/instance/configureCluster';
import instanceState from '../../../state/stores/instanceState';

export default ({ port, setSubmitted, submitted }) => {
  const { auth, url, compute_stack_id, cluster_user } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
    compute_stack_id: s.compute_stack_id,
    cluster_user: s.network?.cluster_user,
  }));

  return (
    <>
      <hr />
      <Button
        color="success"
        block
        onClick={() => {
          configureCluster({
            compute_stack_id,
            cluster_user,
            port,
            auth,
            url,
          });
          setSubmitted(true);
        }}
        disabled={submitted}
      >
        Enable Instance Clustering
      </Button>
    </>
  );
};
