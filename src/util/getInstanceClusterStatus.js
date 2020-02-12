import queryInstance from './queryInstance';

export default async (auth) => {
  const clusterResponse = await queryInstance({ operation: 'cluster_status' }, auth);
  const instanceRoles = await queryInstance({ operation: 'list_roles' }, auth);
  const cluster_role = instanceRoles.find((r) => r.role === 'cluster_user');
  const instanceUsers = await queryInstance({ operation: 'list_users' }, auth);
  const cluster_user = cluster_role && instanceUsers.find((u) => u.role.id === cluster_role.id);

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
    inbound_connections: inbound_connections ? inbound_connections.filter((c) => c.host_address.indexOf('::ffff') === -1) : [],
    outbound_connections: outbound_connections ? outbound_connections.filter((c) => c.host_address.indexOf('::ffff') === -1) : [],
    name: __originator && Object.keys(__originator)[0],
  };
};
