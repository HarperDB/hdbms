import clusterStatus from '../api/instance/clusterStatus';
import listUsers from '../api/instance/listUsers';
import listRoles from '../api/instance/listRoles';
import instanceState from '../state/instanceState';
import buildInstanceClusterPartners from './buildInstanceClusterPartners';
import buildClusteringTable from './buildClusteringTable';
import clusterConfigColumns from './buildClusterConfigColumns';
import clusterGetRoutes from '../api/instance/clusterGetRoutes';
import clusterSetRoutes from '../api/instance/clusterSetRoutes';
import describeAll from '../api/instance/describeAll';
import buildInstanceDataStructure from './buildInstanceDataStructure';

// eslint-disable-next-line no-unused-vars
const processNatsConnections = async ({ auth, url, thisInstance, instances, connections }) => {
  const clusterDefaultPort = 12345;
  const existingRoutes = await clusterGetRoutes({ auth, url });
  const unregisteredRoutes = instances
  .filter((i) => i.compute_stack_id !== thisInstance.compute_stack_id && i.clusterEngine === thisInstance.clusterEngine && !existingRoutes.hub.find((er) => er.host === i.host && er.port === clusterDefaultPort))
  .map((i) => ({ host: i.host, port: clusterDefaultPort }));

  if(unregisteredRoutes.length) {
    await clusterSetRoutes({ auth, url, server: 'hub', routes: unregisteredRoutes });
  }
  const natsConnections = await clusterGetRoutes({ auth, url });

  return natsConnections.hub.map((c) => {
    const connectedInstance = instances.find((i) => i.host === c.host);
    const connectedInstanceSubscriptions = connections.find((i) => i.node_name === connectedInstance.compute_stack_id);
    const hydratedSubscriptions = connectedInstanceSubscriptions?.subscriptions?.map((s) => ({ channel: `${s.schema}:${s.table}`, ...s })) || [];
    return { host: c.host, port: c.port, state: 'open', name: connectedInstance.compute_stack_id, subscriptions: hydratedSubscriptions };
  });
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

const buildNetwork = async ({ auth, url, instances, compute_stack_id }) => {
  const thisInstance = instances.find((i) => i.compute_stack_id === compute_stack_id);
  const schema = await describeAll({ auth, url });
  const { structure } = buildInstanceDataStructure(schema);
  const roles = await listRoles({ auth, url });
  const users = await listUsers({ auth, url });
  const clusterStatusObject = await clusterStatus({ auth, url });
  const { is_enabled, node_name, status, message, connections } = clusterStatusObject;
  const cluster_role = roles.find((r) => r.permission.cluster_user);
  const cluster_user = cluster_role && users.find((u) => u.role === cluster_role.role);
  const processedConnections = (message || !is_enabled) ? []
    : thisInstance.clusterEngine === 'nats' ? await processNatsConnections({ auth, url, thisInstance, instances, connections })
      : processConnections({ connections: status.outbound_connections });

  const network = {
    is_enabled,
    cluster_role,
    cluster_user: cluster_user?.username,
    connections: processedConnections,
    name: node_name,
  };

  const clustering = buildInstanceClusterPartners({
    instances: instances.filter((i) => i.compute_stack_id !== compute_stack_id),
    network,
    instance_region: thisInstance.instance_region,
    instance_wavelength_zone_id: thisInstance.wavelength_zone_id,
    instance_cluster_engine: thisInstance.clusterEngine,
  });

  const clusterDataTable = buildClusteringTable({ instances: clustering.connected.filter((i) => i.connection.state !== 'closed'), structure });

  const clusterDataTableColumns = clusterConfigColumns({
    auth,
    url: thisInstance.url,
    is_local: thisInstance.is_local,
    compute_stack_id,
    customer_id: thisInstance.customer_id,
    buildNetwork: () => buildNetwork({ auth, url, instances, compute_stack_id }),
  });

  instanceState.update((s) => {
    s.network = network;
    s.clustering = clustering;
    s.clusterDataTable = clusterDataTable;
    s.clusterDataTableColumns = clusterDataTableColumns;
  });

  return {
    network,
    clustering,
    clusterDataTable,
    clusterDataTableColumns,
  };
};

export default buildNetwork;
