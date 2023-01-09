import React, { useState } from 'react';
import { Button } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';

import setConfiguration from '../../../../functions/api/instance/setConfiguration';
import restartInstance from '../../../../functions/api/instance/restartInstance';
import instanceState from '../../../../functions/state/instanceState';
import configureCluster from '../../../../functions/api/instance/configureCluster';

function Enable({ setConfiguring, clusterStatus }) {
  const { compute_stack_id } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth, [compute_stack_id]);
  const url = useStoreState(instanceState, (s) => s.url, [compute_stack_id]);
  const clusterEngine = useStoreState(instanceState, (s) => (parseFloat(s.registration?.version) >= 4 ? 'nats' : 'socketcluster'), [compute_stack_id]);
  const [formState, setFormState] = useState({});

  useAsyncEffect(async () => {
    if (formState.submitted) {
      if (clusterEngine === 'nats') {
        await setConfiguration({
          auth,
          url,
          clustering_enabled: true,
        });
      } else {
        await configureCluster({
          auth,
          url,
          CLUSTERING_USER: clusterStatus?.config_cluster_user,
          NODE_NAME: clusterStatus?.node_name,
          CLUSTERING: true,
        });
      }
      if (window._kmq) window._kmq.push(['record', 'enabled clustering']);
      restartInstance({ auth, url });
      setTimeout(() => setConfiguring(true), 0);
    }
  }, [formState.submitted]);

  return (
    <>
      <hr className="my-3" />
      <Button color="success" disabled={formState.submitted} block onClick={() => setFormState({ submitted: true })}>
        {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : 'Enable Instance Clustering'}
      </Button>
    </>
  );
}

export default Enable;
