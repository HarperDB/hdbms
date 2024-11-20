import instanceState from '../../state/instanceState';
import instanceManagerGroups from './instanceManagerGroups';
import datatableFormat from './datatableFormat';
import datatableRows from './datatableRows';
import processInstance from './processInstance';
import processNatsConnections from './processNatsConnections';
import processSocketClusterConnections from './processSocketClusterConnections';
const buildNetwork = async ({
  auth,
  url,
  instances,
  computeStackId,
  instanceAuths,
  setLoading
}) => {
  const hydratedInstances = await Promise.all(instances.filter(i => !!instanceAuths[i.computeStackId]).map(instance => processInstance({
    instance,
    auth: instanceAuths[instance.computeStackId]
  })));
  const thisInstance = hydratedInstances.find(i => i.computeStackId === computeStackId);
  const processedConnections = thisInstance.clustering.message || !thisInstance.clustering.isEnabled ? [] : thisInstance.clustering.engine === 'nats' ? await processNatsConnections({
    auth,
    url,
    instances: hydratedInstances,
    connections: thisInstance.clustering.connections
  }) : processSocketClusterConnections({
    connections: thisInstance.clustering.status.outboundConnections
  });
  const network = {
    isEnabled: thisInstance.clustering.isEnabled,
    connections: processedConnections
  };
  const clusterPartners = instanceManagerGroups({
    instances: hydratedInstances.filter(i => instanceAuths[i.computeStackId] && i.computeStackId !== computeStackId),
    network,
    instanceRegion: thisInstance.instanceRegion,
    instanceWavelengthZoneId: thisInstance.wavelengthZoneId,
    instanceClusterEngine: thisInstance.clustering.engine
  });
  const clusterDataTable = datatableFormat({
    instances: clusterPartners.connected.filter(i => i.connection.state !== 'closed'),
    structure: thisInstance.structure
  });
  const clusterDataTableColumns = datatableRows({
    auth,
    url: thisInstance.url,
    computeStackId,
    buildNetwork: () => buildNetwork({
      auth,
      url,
      instances,
      computeStackId,
      instanceAuths,
      setLoading
    }),
    setLoading
  });
  instanceState.update(s => {
    s.network = network;
    s.clusterPartners = clusterPartners;
    s.clusterDataTable = clusterDataTable;
    s.clusterDataTableColumns = clusterDataTableColumns;
    s.instances = hydratedInstances;
  });
  setLoading(false);
  return {
    network,
    clusterPartners,
    clusterDataTable,
    clusterDataTableColumns
  };
};
export default buildNetwork;