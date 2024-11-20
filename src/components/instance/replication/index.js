import React, { useState, useCallback, useEffect } from 'react';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';
import { useParams } from 'react-router-dom';
import instanceState from '../../../functions/state/instanceState';
import Setup from './setup';
import Manage from './manage';
import Loader from '../../shared/Loader';
import EmptyPrompt from '../../shared/EmptyPrompt';
import checkClusterStatus from '../../../functions/instance/clustering/checkClusterStatus';
function ClusteringIndex() {
  const {
    computeStackId
  } = useParams();
  const auth = useStoreState(instanceState, s => s.auth, [computeStackId]);
  const url = useStoreState(instanceState, s => s.url, [computeStackId]);
  const [clusterStatus, setClusterStatus] = useState(false);
  const [configuring, setConfiguring] = useState(false);
  const refreshStatus = useCallback(async () => {
    if (auth && url) {
      const result = await checkClusterStatus({
        auth,
        url
      });
      setClusterStatus(result);
      if (result.isReady) {
        setConfiguring(false);
      }
    }
  }, [auth, url]);
  useInterval(async () => {
    if (configuring) {
      refreshStatus();
    }
  }, 3000);
  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);
  useEffect(() => {
    setClusterStatus(false);
  }, [computeStackId]);
  return !clusterStatus ? <Loader header="loading network" spinner /> : configuring ? <EmptyPrompt description="Configuring Clustering" icon={<i className="fa fa-spinner fa-spin" />} /> : clusterStatus.isReady ? <Manage configuring={configuring} /> : <Setup setConfiguring={setConfiguring} clusterStatus={clusterStatus} refreshStatus={refreshStatus} />;
}
export default ClusteringIndex;