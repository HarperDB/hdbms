const processConnections = (connections) =>
  connections
    ? connections
        .filter((c) => c.host_address.indexOf('::ffff') === -1)
        .map((c) => ({
          name: c.node_name,
          host: c.host_address,
          port: c.host_port,
          state: c.state,
          subscriptions: c.subscriptions,
        }))
    : [];

export default async ({ users, roles, cluster_status }) => {
  const { is_enabled, node_name, status } = cluster_status;

  const cluster_role = roles.find((r) => r.role === 'cluster_user');

  const cluster_user = cluster_role && users.find((u) => u.role.id === cluster_role.id);

  const networkObject = {
    is_enabled,
    cluster_role: cluster_role?.id,
    cluster_user: cluster_user?.username,
    inbound_connections: [],
    outbound_connections: [],
    name: node_name,
  };

  if (cluster_status.message || !cluster_status.is_enabled) {
    return networkObject;
  }

  return { ...networkObject, inbound_connections: processConnections(status.inbound_connections), outbound_connections: processConnections(status.outbound_connections) };
};
