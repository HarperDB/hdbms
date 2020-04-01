import React from 'react';
import { Button } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import configureCluster from '../../../api/instance/configureCluster';
import instanceState from '../../../state/stores/instanceState';

export default ({ port, setSubmitted, submitted }) => {
  const { auth, url, instance_name, cluster_user } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
    instance_name: s.instance_name,
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
            instance_name,
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
