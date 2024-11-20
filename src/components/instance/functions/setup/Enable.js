import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';
import useAsyncEffect from 'use-async-effect';
import instanceState from '../../../../functions/state/instanceState';
import setConfiguration from '../../../../functions/api/instance/setConfiguration';
import restartInstance from '../../../../functions/api/instance/restartInstance';
import checkClusterStatus from '../../../../functions/instance/clustering/checkClusterStatus';
function Enable({
  setConfiguring
}) {
  const {
    computeStackId
  } = useParams();
  const auth = useStoreState(instanceState, s => s.auth, [computeStackId]);
  const url = useStoreState(instanceState, s => s.url, [computeStackId]);
  const clusterEngine = useStoreState(instanceState, s => parseFloat(s.registration?.version) >= 4 ? 'nats' : 'socketcluster', [computeStackId]);
  const [formState, setFormState] = useState({});
  useAsyncEffect(async () => {
    if (formState.submitted) {
      if (clusterEngine === 'nats') {
        await setConfiguration({
          auth,
          url,
          customFunctionsEnabled: true
        });
      } else {
        const clusterStatus = await checkClusterStatus({
          auth,
          url
        });
        await setConfiguration({
          auth,
          url,
          operation: 'configure_cluster',
          CUSTOM_FUNCTIONS: true,
          CLUSTERING: Boolean(clusterStatus?.configClusterUser),
          CLUSTERING_PORT: clusterStatus?.configClusterPort,
          CLUSTERING_USER: clusterStatus?.configClusterUser,
          NODE_NAME: clusterStatus?.nodeName
        });
      }
      if (window.Kmq) window.Kmq.push(['record', 'enabled custom functions']);
      restartInstance({
        auth,
        url
      });
      setTimeout(() => setConfiguring(true), 0);
    }
  }, [formState.submitted]);
  return <>
      <hr className="my-3" />
      <Button color="success" disabled={formState.submitted} block onClick={() => setFormState({
      submitted: true
    })}>
        {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : 'Enable Custom Functions'}
      </Button>
    </>;
}
export default Enable;