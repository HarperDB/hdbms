import clusterStatus from '../api/instance/clusterStatus';
import listUsers from '../api/instance/listUsers';
import listRoles from '../api/instance/listRoles';
import instanceState from '../state/instanceState';
import buildInstanceClusterPartners from './buildInstanceClusterPartners';
import buildClusteringTable from './buildClusteringTable';
import buildClusterConfigColumns from './buildClusterConfigColumns';
import clusterGetRoutes from '../api/instance/clusterGetRoutes';
import describeAll from '../api/instance/describeAll';
import buildInstanceDataStructure from './buildInstanceDataStructure';
import registrationInfo from '../api/instance/registrationInfo';
import getConfiguration from '../api/instance/getConfiguration';

const processInstance = async ({ instance, auth }) => {
  const clustering = auth && (await clusterStatus({ auth, url: instance.url }));
  const registration = auth && (await registrationInfo({ auth, url: instance.url }));
  const config_info = auth && (await getConfiguration({ auth, url: instance.url }));
  const schema = auth && (await describeAll({ auth, url: instance.url }));
  const { structure } = schema ? buildInstanceDataStructure(schema) : { structure: {} };
  const cluster_engine = parseFloat(registration?.version) >= 4 ? 'nats' : 'socketcluster';
  const urlObject = new URL(instance.url);
  const instanceObject = {
    ...instance,
    auth,
    registration,
    structure,
    host: urlObject.host,
    clustering: {
      engine: cluster_engine,
      is_enabled: clustering?.is_enabled,
      node_name: clustering?.node_name,
      node_name_set: clustering?.node_name === instance.compute_stack_id,
      port: cluster_engine === 'socketcluster' ? config_info?.CLUSTERING_PORT : config_info?.clustering?.hubServer?.cluster?.network?.port,
      status: clustering?.status,
      message: clustering?.message,
      connections: clustering?.connections,
    },
  };
  return Object.entries(instanceObject).reduce((a, [k, v]) => (v == null ? a : ((a[k] = v), a)), {});
};

const processNatsConnections = async ({ auth, url, instances, connections }) => {
  const natsConnections = await clusterGetRoutes({ auth, url });

  return natsConnections.hub
    .map((c) => {
      const connectedInstance = instances.find((i) => i.host === c.host || i.private_ip === c.host);
      if (!connectedInstance) {
        return false;
      }
      const connectedInstanceHost = connectedInstance.host === connectedInstance.private_ip ? connectedInstance.private_ip : connectedInstance.host;
      const connectedInstanceSubscriptions = connections.find((i) => i.node_name === connectedInstance?.compute_stack_id);
      const hydratedSubscriptions = connectedInstanceSubscriptions?.subscriptions?.map((s) => ({ channel: `${s.schema}:${s.table}`, ...s })) || [];
      return { host: connectedInstanceHost, port: c.port, state: 'open', name: connectedInstance?.compute_stack_id, subscriptions: hydratedSubscriptions };
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

const buildNetwork = async ({ auth, url, instances, compute_stack_id, instanceAuths, setLoading }) => {
  setLoading(compute_stack_id);
  const hydratedInstances = await Promise.all(
    instances.filter((i) => !!instanceAuths[i.compute_stack_id]).map((instance) => processInstance({ instance, auth: instanceAuths[instance.compute_stack_id] }))
  );
  const thisInstance = hydratedInstances.find((i) => i.compute_stack_id === compute_stack_id);

  const roles = await listRoles({ auth, url });
  const users = await listUsers({ auth, url });
  const cluster_role = roles.find((r) => r.permission.cluster_user);
  const cluster_user = cluster_role && users.find((u) => u.role === cluster_role.role);

  const processedConnections =
    thisInstance.clustering.message || !thisInstance.clustering.is_enabled
      ? []
      : thisInstance.clustering.engine === 'nats'
      ? await processNatsConnections({ auth, url, instances: hydratedInstances, connections: thisInstance.clustering.connections })
      : processConnections({ connections: thisInstance.clustering.status.outbound_connections });

  const network = {
    is_enabled: thisInstance.clustering.is_enabled,
    name: thisInstance.clustering.node_name,
    cluster_role,
    cluster_user: cluster_user?.username,
    connections: processedConnections,
  };

  const clusterPartners = buildInstanceClusterPartners({
    instances: hydratedInstances.filter((i) => instanceAuths[i.compute_stack_id] && i.compute_stack_id !== compute_stack_id),
    network,
    instance_region: thisInstance.instance_region,
    instance_wavelength_zone_id: thisInstance.wavelength_zone_id,
    instance_cluster_engine: thisInstance.clustering.engine,
  });

  const clusterDataTable = buildClusteringTable({
    instances: clusterPartners.connected.filter((i) => i.connection.state !== 'closed'),
    structure: thisInstance.structure,
  });

  const clusterDataTableColumns = buildClusterConfigColumns({
    auth,
    url: thisInstance.url,
    is_local: thisInstance.is_local,
    compute_stack_id,
    customer_id: thisInstance.customer_id,
    buildNetwork: () => buildNetwork({ auth, url, instances, compute_stack_id, instanceAuths, setLoading }),
    setLoading,
  });

  instanceState.update((s) => {
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
    clusterDataTableColumns,
  };
};

export default buildNetwork;
