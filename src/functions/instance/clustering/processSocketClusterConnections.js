const processSocketClusterConnections = ({
  connections
}) => connections ? connections.filter(c => c.hostAddress.indexOf('::ffff') === -1).map(c => ({
  name: c.nodeName,
  host: c.hostAddress,
  port: c.hostPort,
  state: c.state,
  subscriptions: c.subscriptions
})) : [];
export default processSocketClusterConnections;