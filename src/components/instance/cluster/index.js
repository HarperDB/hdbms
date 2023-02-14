import React, { useState, useCallback, useEffect } from 'react';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';
import { useParams } from 'react-router-dom';

import instanceState from '../../../functions/state/instanceState';

import Setup from './setup';
import Manage from './manage';
import ClusterDisabled from './disabled';
import Loader from '../../shared/Loader';
import EmptyPrompt from '../../shared/EmptyPrompt';
import checkClusterStatus from '../../../functions/instance/clustering/checkClusterStatus';

export const metadata = {
  path: `cluster`,
  link: 'cluster',
  label: 'cluster',
  icon: 'cubes',
  iconCode: 'f1e0',
};

function ClusteringIndex() {
  const { compute_stack_id } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth, [compute_stack_id]);
  const url = useStoreState(instanceState, (s) => s.url, [compute_stack_id]);
  const is_local = useStoreState(instanceState, (s) => s.is_local, [compute_stack_id]);
  const registrationVersion = useStoreState(instanceState, (s) => s.registration?.version, [compute_stack_id]);
  const [clusterStatus, setClusterStatus] = useState(false);
  const [configuring, setConfiguring] = useState(false);
  const clusterDisabled = parseFloat(registrationVersion) >= 4 && !is_local;

  const refreshStatus = useCallback(async () => {
    if (auth && url && !clusterDisabled) {
      const result = await checkClusterStatus({ auth, url });
      setClusterStatus(result);
      if (result.is_ready) {
        setConfiguring(false);
      }
    }
  }, [auth, url, clusterDisabled]);

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
  }, [compute_stack_id]);

  return clusterDisabled ? (
    <ClusterDisabled />
  ) : !clusterStatus ? (
    <Loader header="loading network" spinner />
  ) : configuring ? (
    <EmptyPrompt description="Configuring Clustering" icon={<i className="fa fa-spinner fa-spin" />} />
  ) : clusterStatus.is_ready ? (
    <Manage configuring={configuring} />
  ) : (
    <Setup setConfiguring={setConfiguring} clusterStatus={clusterStatus} refreshStatus={refreshStatus} />
  );
}

export default ClusteringIndex;
