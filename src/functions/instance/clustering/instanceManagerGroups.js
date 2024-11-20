export default ({
  instances,
  network,
  instanceRegion,
  instanceWavelengthZoneId,
  instanceClusterEngine
}) => {
  const activeInstances = instances.filter(i => i.url && i.status !== 'DELETE_IN_PROGRESS');
  const compatibleInstances = activeInstances.filter(i => i.clustering.engine === instanceClusterEngine);
  const processedInstances = compatibleInstances.map(i => {
    const connection = instanceClusterEngine === 'socketcluster' ? network?.connections.find(n => n.name === i.computeStackId) : network?.connections.find(n => n.host === i.host);
    const subscriptions = connection?.subscriptions || [];
    const clusterPort = i?.clustering?.configClusterPort;
    const instanceStatus = i.isLocal ? 'OK' : i.status;
    const instanceHost = instanceRegion && instanceRegion === i.instanceRegion && !i.wavelengthZoneId && !instanceWavelengthZoneId ? i.privateIp : i.url.match(/^https?:\/\/([^/:?#]+)(?:[/:?#]|$)/i)[1];
    const clusterName = i.clustering.nodeName;
    return {
      instanceName: i.instanceName,
      instanceUrl: i.url,
      computeStackId: i.computeStackId,
      instanceStatus,
      instanceHost,
      clusterPort,
      clusterName,
      connection,
      subscriptions,
      structure: i.structure,
      configured: i.clustering?.isReady
    };
  });
  const unreachable = instances.filter(i => i.clustering.engine !== instanceClusterEngine).map(i => ({
    instanceName: i.instanceName,
    computeStackId: i.name
  }));
  const connected = processedInstances.filter(i => i.connection && i.configured);
  const unconnected = processedInstances.filter(i => !i.connection && i.configured);
  const unconfigured = processedInstances.filter(i => !i.configured);
  return {
    connected,
    unconnected,
    unconfigured,
    unreachable
  };
};