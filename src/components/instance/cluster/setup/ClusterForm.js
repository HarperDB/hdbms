import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { useStoreState } from 'pullstate';

import instanceState from '../../../../functions/state/instanceState';
import restartInstance from '../../../../functions/api/instance/restartInstance';
import setConfiguration from '../../../../functions/api/instance/setConfiguration';
import configureCluster from '../../../../functions/api/instance/configureCluster';
import addUser from '../../../../functions/api/instance/addUser';

import FormValidationError from '../../../shared/FormValidationError';
import ClusterField from './ClusterField';

function ClusterForm({ setConfiguring, clusterStatus, refreshStatus, compute_stack_id }) {

  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const clusterEngine = clusterStatus.engine;
  const clusterPortMin = 1024;
  const clusterPortMax = 65535;

  const [formData, setFormData] = useState({
    clusterRole: clusterStatus?.cluster_role?.role || '', // implies that it might not exist, but it should.
    clusterUsername: clusterStatus?.cluster_user?.username || 'cluster_user',
    clusterPassword: clusterStatus?.cluster_user?.password || '',
    clusterPort: clusterStatus?.config_cluster_port || '',
    clusterNodeName: clusterStatus?.node_name || compute_stack_id
  });

  const [serverResponseError, setServerResponseError] = useState(null);

  function formIsValid({ clusterRole, clusterUsername, clusterPassword, clusterPort, clusterNodeName }) {
      return clusterRole?.length > 0 &&
             clusterUsername.length > 0 &&
             clusterPassword.length > 0 &&
             clusterNodeName.length > 0 &&
             clusterPort >= clusterPortMin && clusterPort <= clusterPortMax;
  }

  function updateForm(update) {
    setFormData({...formData, ...update});
  }

  async function enableClustering() {

    setServerResponseError(null);

    // creates cluster user
    if (!clusterStatus.cluster_user) {
      const response = await addUser({
        auth,
        url,
        role: formData.clusterRole,
        username: formData.clusterUsername,
        password: formData.clusterPassword
      });

      if (response.error) {
        setServerResponseError(response.message);
        return;
      }

    }

    // TODO: update docs when this is finished
    // https://docs.harperdb.io/docs/harperdb-studio/manage-clustering#initial-configuration

    // enables clustering with port, nodename and cluster_user
    const result = (clusterEngine === 'nats') ?
      await setConfiguration({
        auth,
        url,
        clustering_enabled: true,
        clustering_nodeName: formData.clusterNodeName,
        clustering_port: formData.clusterPort,
        clustering_user: formData.clusterUsername
      }) :
      await configureCluster({
        auth,
        url,
        CLUSTERING: true,
        CLUSTERING_PORT: formData.clusterPort,
        CLUSTERING_USER: formData.clusterUsername,
        NODE_NAME: formData.clusterNodeName,
      });

    if (result.error) {
      setServerResponseError(result.message);
      return;
    }

    if (window._kmq) {
      window._kmq.push(['record', 'enabled clustering']);
    }

    await restartInstance({ auth, url });
    setTimeout(() => setConfiguring(true), 0);

    refreshStatus();

  }

  return (
    <>
      <ClusterField
        label="Cluster Role"
        value={formData.clusterRole} />

      <ClusterField
        label="Cluster User"
        handleChange={(clusterUsername) => updateForm({ clusterUsername }) }
        value={formData.clusterUsername }
        validator={(value) => value.trim().length > 0}
        errorMessage='Please enter a cluster username'
        editable />

      <ClusterField
        label="Cluster Password"
        type="password"
        handleChange={(clusterPassword) => updateForm({ clusterPassword }) }
        value={formData.clusterPassword}
        validator={(value) => value.trim().length > 0}
        errorMessage='Please enter a password'
        editable />

      <ClusterField
        label="Cluster Port"
        type="number"
        max={clusterPortMax}
        min={clusterPortMin}
        handleChange={(newClusterPort) => updateForm({ clusterPort: newClusterPort })}
        value={formData.clusterPort}
        validator={(value) => value >= clusterPortMin && value <= clusterPortMax}
        errorMessage={`Please enter a port number between ${clusterPortMin} and ${clusterPortMax}`}
        editable />

      <ClusterField
        label="Cluster Node Name"
        handleChange={(newClusterNodeName) => updateForm({ clusterNodeName: newClusterNodeName }) }
        value={formData.clusterNodeName}
        validator={(value) => value.length > 0}
        errorMessage="Please enter a cluster node name"
        editable />

      <hr className="my-3" />
      <FormValidationError error={serverResponseError} />
      <Button
        block
        color="success"
        disabled={ !formIsValid(formData) }
        onClick={ () => enableClustering() }>
        Enable Clustering
      </Button>

    </>
  )

}

export default ClusterForm;
