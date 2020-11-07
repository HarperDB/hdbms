import clusterStatus from '../api/instance/clusterStatus';
import listUsers from '../api/instance/listUsers';
import listRoles from '../api/instance/listRoles';
import instanceState from '../state/instanceState';
import buildInstanceClusterPartners from './buildInstanceClusterPartners';
import buildClusteringTable from './buildClusteringTable';
import clusterConfigColumns from './buildClusterConfigColumns';

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

export default async ({ auth, url, instances, compute_stack_id, structure }) => {
  const thisInstance = instances.find((i) => i.compute_stack_id === compute_stack_id);
  const users = await listUsers({ auth, url });
  const roles = await listRoles({ auth, url });
  const { is_enabled, node_name, status, message } = await clusterStatus({ auth, url });
  const cluster_role = roles && Array.isArray(roles) && roles.find((r) => r.role === 'cluster_user');
  const cluster_user = cluster_role && users.find((u) => u.role.id === cluster_role.id);

  const networkObject = {
    is_enabled,
    cluster_role: cluster_role?.id,
    cluster_user: cluster_user?.username,
    inbound_connections: message || !is_enabled ? [] : processConnections(status.inbound_connections),
    outbound_connections: message || !is_enabled ? [] : processConnections(status.outbound_connections),
    name: node_name,
  };

  const clustering = buildInstanceClusterPartners({
    instances: instances.filter((i) => i.compute_stack_id !== compute_stack_id),
    network: networkObject,
    instance_region: thisInstance.instance_region,
  });

  const clusterDataTable = buildClusteringTable({ instances: clustering.connected.filter((i) => i.connection.state !== 'closed'), structure });
  const clusterDataTableColumns = clusterConfigColumns({ auth, url: thisInstance.url, is_local: thisInstance.is_local, compute_stack_id, customer_id: thisInstance.customer_id });

  return instanceState.update((s) => {
    s.network = networkObject;
    s.clustering = clustering;
    s.clusterDataTable = clusterDataTable;
    s.clusterDataTableColumns = clusterDataTableColumns;
  });
};
