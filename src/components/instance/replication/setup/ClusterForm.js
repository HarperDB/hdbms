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
import addRole from '../../../../functions/api/instance/addRole';
function ClusterForm({
  setConfiguring,
  clusterStatus,
  refreshStatus,
  computeStackId
}) {
  const auth = useStoreState(instanceState, s => s.auth);
  const url = useStoreState(instanceState, s => s.url);
  const clusterEngine = clusterStatus.engine;
  const clusterPortMin = 1024;
  const clusterPortMax = 65535;
  const [formData, setFormData] = useState({
    clusterRole: clusterStatus?.clusterRole?.role,
    clusterUsername: clusterStatus?.clusterUser?.username || 'cluster_user',
    clusterPassword: clusterStatus?.clusterUser?.password || '',
    clusterPort: clusterStatus?.configClusterPort || '',
    clusterNodeName: clusterStatus?.nodeName || computeStackId
  });
  const [serverResponseError, setServerResponseError] = useState(null);
  function formIsValid({
    clusterRole,
    clusterUsername,
    clusterPassword,
    clusterPort,
    clusterNodeName
  }) {
    return clusterRole?.length > 0 && clusterUsername.length > 0 && (clusterStatus?.clusterUser?.username || clusterPassword.length > 0) && clusterNodeName.length > 0 && clusterPort >= clusterPortMin && clusterPort <= clusterPortMax;
  }
  function updateForm(update) {
    setFormData({
      ...formData,
      ...update
    });
  }
  async function enableClustering() {
    setServerResponseError(null);

    // creates cluster role
    if (!clusterStatus.clusterRole?.role) {
      const response = await addRole({
        auth,
        url,
        role: formData.clusterRole,
        permission: {
          clusterUser: true
        }
      });
      if (response.error) {
        return setServerResponseError(response.message);
      }
    }

    // creates cluster user
    if (!clusterStatus.clusterUser) {
      const response = await addUser({
        auth,
        url,
        role: formData.clusterRole,
        username: formData.clusterUsername,
        password: formData.clusterPassword
      });
      if (response.error) {
        return setServerResponseError(response.message);
      }
    }

    // TODO: update docs when this is finished
    // https://docs.harperdb.io/docs/harperdb-studio/manage-clustering#initial-configuration

    // enables clustering with port, nodename and cluster_user
    const result = clusterEngine === 'nats' ? await setConfiguration({
      auth,
      url,
      clusteringEnabled: true,
      clusteringNodeName: formData.clusterNodeName,
      clusteringPort: formData.clusterPort,
      clusteringUser: formData.clusterUsername
    }) : await configureCluster({
      auth,
      url,
      CLUSTERING: true,
      CLUSTERING_PORT: formData.clusterPort,
      CLUSTERING_USER: formData.clusterUsername,
      NODE_NAME: formData.clusterNodeName
    });
    if (result.error) {
      return setServerResponseError(result.message);
    }
    if (window.Kmq) {
      window.Kmq.push(['record', 'enabled clustering']);
    }
    await restartInstance({
      auth,
      url
    });
    setTimeout(() => setConfiguring(true), 0);
    return refreshStatus();
  }
  return <>
      <ClusterField label="Cluster Role" handleChange={clusterRole => updateForm({
      clusterRole
    })} value={formData.clusterRole} valid={formData.clusterRole.trim().length > 0} validator={value => value.trim().length > 0} editable={!clusterStatus?.clusterRole?.role} addSpace={false} />

      <ClusterField label="Cluster User" handleChange={clusterUsername => updateForm({
      clusterUsername
    })} value={formData.clusterUsername} valid={formData.clusterUsername.trim().length > 0} validator={value => value.trim().length > 0} editable={!clusterStatus?.clusterUser?.username} />

      <ClusterField label="Cluster Password" type="password" handleChange={clusterPassword => updateForm({
      clusterPassword
    })} value={clusterStatus?.clusterUser?.username ? '********' : formData.clusterPassword} valid={clusterStatus?.clusterUser?.username || formData.clusterPassword.trim().length > 0} validator={value => value.trim().length > 0} editable={!clusterStatus?.clusterUser?.username} showDivider={false} />

      <ClusterField label="Cluster Port" type="number" max={clusterPortMax} min={clusterPortMin} handleChange={newClusterPort => updateForm({
      clusterPort: newClusterPort
    })} value={formData.clusterPort} valid={formData.clusterPort >= clusterPortMin && formData.clusterPort <= clusterPortMax} validator={value => value >= clusterPortMin && value <= clusterPortMax} errorMessage={`must be between ${clusterPortMin} and ${clusterPortMax}`} editable={!clusterStatus?.configClusterPort} />

      <ClusterField label="Cluster Node Name" handleChange={newClusterNodeName => updateForm({
      clusterNodeName: newClusterNodeName
    })} value={formData.clusterNodeName} valid={formData.clusterNodeName.length > 0} validator={value => value.length > 0} editable={!clusterStatus?.nodeName} />

      <hr className="my-3" />
      <Button block color="success" disabled={!formIsValid(formData)} onClick={enableClustering}>
        Enable Clustering
      </Button>
      <br />
      {serverResponseError && <FormValidationError error={serverResponseError} />}
    </>;
}
export default ClusterForm;