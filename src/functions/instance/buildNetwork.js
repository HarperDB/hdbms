import clusterStatus from '../api/instance/clusterStatus';
import listUsers from '../api/instance/listUsers';
import listRoles from '../api/instance/listRoles';
import instanceState from '../state/instanceState';
import buildInstanceClusterPartners from './buildInstanceClusterPartners';
import buildClusteringTable from './buildClusteringTable';
import buildClusterConfigColumns from './buildClusterConfigColumns';
import clusterGetRoutes from '../api/instance/clusterGetRoutes';
import getInstances from '../api/lms/getInstances';
import getConfiguration from '../api/instance/getConfiguration';

const processNatsConnections = async ({ auth, url, instances, connections }) => {
  const natsConnections = await clusterGetRoutes({ auth, url });

  return natsConnections.hub
    .map((c) => {
      const connectedInstance = instances.find((i) => i.host === c.host);
      if (!connectedInstance) {
        return false;
      }
      const connectedInstanceSubscriptions = connections.find((i) => i.node_name === connectedInstance?.compute_stack_id);
      const hydratedSubscriptions = connectedInstanceSubscriptions?.subscriptions?.map((s) => ({ channel: `${s.schema}:${s.table}`, ...s })) || [];
      return { host: c.host, port: c.port, state: 'open', name: connectedInstance?.compute_stack_id, subscriptions: hydratedSubscriptions };
    })
    .filter((c) => c !== false);
};

const processConnections = ({ connections }) =>
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

const buildNetwork = async ({ appAuth, auth, compute_stack_id, customer_id, products, regions, subscriptions, instanceAuths, setLoading }) => {
  const instances = await getInstances({ auth: appAuth, customer_id, products, regions, subscriptions, instanceAuths });

  const { instance_region, wavelength_zone_id, url, is_local, clustering, structure } = instances.find((i) => i.compute_stack_id === compute_stack_id);
  const roles = await listRoles({ auth, url });
  const users = await listUsers({ auth, url });
  const clusterStatusObject = await clusterStatus({ auth, url });
  const configurationObject = await getConfiguration({ auth, url });
  const { is_enabled, node_name, status, message, connections } = clusterStatusObject;
  const cluster_role = roles.find((r) => r.permission.cluster_user);
  const cluster_user = cluster_role && users.find((u) => u.role === cluster_role.role);
  const processedConnections =
    message || !is_enabled
      ? []
      : clustering.engine === 'nats'
      ? await processNatsConnections({ auth, url, instances, connections })
      : processConnections({ connections: status.outbound_connections });

  const network = {
    is_enabled,
    cluster_role,
    cluster_port: clustering.engine === 'nats' ? configurationObject.clustering.hubServer.cluster.network.port : configurationObject.CLUSTERING_PORT,
    cluster_user: cluster_user?.username,
    connections: processedConnections,
    name: node_name,
  };

  const clusterPartners = buildInstanceClusterPartners({
    instances: instances.filter((i) => i.compute_stack_id !== compute_stack_id),
    network,
    instance_region,
    instance_wavelength_zone_id: wavelength_zone_id,
    instance_cluster_engine: clustering.engine,
  });

  const clusterDataTable = buildClusteringTable({ instances: clusterPartners.connected.filter((i) => i.connection.state !== 'closed'), structure });

  const clusterDataTableColumns = buildClusterConfigColumns({
    auth,
    url,
    is_local,
    compute_stack_id,
    customer_id,
    setLoading,
    buildNetwork: () => buildNetwork({ appAuth, auth, compute_stack_id, customer_id, products, regions, subscriptions, instanceAuths, setLoading }),
  });

  instanceState.update((s) => {
    s.network = network;
    s.clusterPartners = clusterPartners;
    s.clusterEngine = clustering.engine;
    s.clusterDataTable = clusterDataTable;
    s.clusterDataTableColumns = clusterDataTableColumns;
  });

  return {
    network,
    clusterPartners,
    clusterDataTable,
    clusterDataTableColumns,
  };
};

export default buildNetwork;
