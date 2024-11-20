import clusterGetRoutes from '../../api/instance/clusterGetRoutes';
const processNatsConnections = async ({
  auth,
  url,
  instances,
  connections
}) => {
  const natsConnections = await clusterGetRoutes({
    auth,
    url
  });
  return natsConnections.hub.map(c => {
    const connectedInstance = instances.find(i => i.host === c.host || i.privateIp === c.host);
    if (!connectedInstance) {
      return false;
    }
    const connectedInstanceHost = connectedInstance.host === connectedInstance.privateIp ? connectedInstance.privateIp : connectedInstance.host;
    const connectedInstanceSubscriptions = connections.find(i => i.nodeName === connectedInstance?.clustering?.nodeName);
    const hydratedSubscriptions = connectedInstanceSubscriptions?.subscriptions?.map(s => ({
      channel: `${s.schema}:${s.table}`,
      ...s
    })) || [];
    return {
      host: connectedInstanceHost,
      port: c.port,
      state: 'open',
      name: connectedInstance?.computeStackId,
      subscriptions: hydratedSubscriptions
    };
  }).filter(c => c !== false);
};
export default processNatsConnections;