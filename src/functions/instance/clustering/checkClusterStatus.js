import getConfiguration from '../../api/instance/getConfiguration';
import listRoles from '../../api/instance/listRoles';
import listUsers from '../../api/instance/listUsers';
import registrationInfo from '../../api/instance/registrationInfo';
import clusterStatus from '../../api/instance/clusterStatus';
const checkClusterStatus = async ({
  auth,
  url
}) => {
  const config = await getConfiguration({
    auth,
    url
  });
  const registration = await registrationInfo({
    auth,
    url
  });
  const clustering = await clusterStatus({
    auth,
    url
  });
  const clusterEngine = parseFloat(registration?.version) >= 4 ? 'nats' : 'socketcluster';
  const roles = await listRoles({
    auth,
    url
  });
  let clusterRole = false;
  if (!roles.error) {
    clusterRole = roles.find(r => r.permission.clusterUser);
  }
  const users = await listUsers({
    auth,
    url
  });
  let clusterUser = false;
  if (!users.error) {
    clusterUser = clusterRole && users.find(u => u.role === clusterRole.role);
  }
  const isEnabled = clusterEngine === 'nats' ? config.clustering.enabled : config.CLUSTERING;
  const configClusterUser = clusterEngine === 'nats' ? config.clustering.user : config.CLUSTERING_USER;
  const configClusterPort = clusterEngine === 'nats' ? config.clustering.hubServer.cluster.network.port : config.CLUSTERING_PORT;
  const nodeName = clusterEngine === 'nats' ? config.clustering.nodeName : config.NODE_NAME;
  const isReady = !!isEnabled && !!clusterUser && !!configClusterUser && !!clusterRole && !!configClusterPort && !!nodeName;
  return {
    isReady,
    clusterRole,
    clusterUser,
    isEnabled,
    configClusterUser,
    configClusterPort,
    nodeName,
    engine: clusterEngine,
    status: clustering?.status,
    message: clustering?.message,
    connections: clustering?.connections
  };
};
export default checkClusterStatus;