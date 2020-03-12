import queryInstance from '../queryInstance';

const processConnections = (connections) => (connections ? connections.filter((c) => c.host_address.indexOf('::ffff') === -1).map((c) => ({
  name: c.node_name,
  host: c.host_address,
  port: c.host_port,
  subscriptions: c.subscriptions,
})) : []);

export default async ({ auth, url, users, roles }) => {
  const clusterResponse = await queryInstance({ operation: 'cluster_status' }, auth, url);
  const cluster_role = roles.find((r) => r.role === 'cluster_user');
  const cluster_user = cluster_role && users.find((u) => u.role.id === cluster_role.id);

  if (clusterResponse.message || !clusterResponse.is_enabled) {
    return {
      is_enabled: false,
      cluster_role: cluster_role && cluster_role.id,
      cluster_user: cluster_user && cluster_user.username,
      inbound_connections: [],
      outbound_connections: [],
      name: false,
    };
  }

  const { is_enabled, status: { inbound_connections, outbound_connections, __originator } } = clusterResponse;

  return {
    is_enabled,
    cluster_role: cluster_role && cluster_role.id,
    cluster_user: cluster_user && cluster_user.username,
    inbound_connections: processConnections(inbound_connections),
    outbound_connections: processConnections(outbound_connections),
    name: __originator && Object.keys(__originator)[0],
  };
};
