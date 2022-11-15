export default ({ instances, network, instance_region, instance_wavelength_zone_id, instance_cluster_engine }) => {
  const activeInstances = instances.filter((i) => i.url && i.status !== 'DELETE_IN_PROGRESS');
  const compatibleInstances = activeInstances.filter((i) => i.clustering.engine === instance_cluster_engine);

  const processedInstances = compatibleInstances.map((i) => {
    const {
      instance_name,
      is_local,
      compute_stack_id,
      structure,
      clustering: { is_enabled, node_name_set },
    } = i;

    const connection = network?.connections.find((n) => n.name === i.compute_stack_id);
    const subscriptions = connection?.subscriptions || [];
    const clusterPort = 12345;
    const instance_status = is_local ? 'OK' : i.status;
    const instance_host =
      instance_region && instance_region === i.instance_region && !i.wavelength_zone_id && !instance_wavelength_zone_id
        ? i.private_ip
        : i.url.match(/^https?:\/\/([^/:?#]+)(?:[/:?#]|$)/i)[1];

    return {
      instance_name,
      instance_url: i.url,
      compute_stack_id,
      instance_status,
      instance_host,
      clusterPort,
      connection,
      subscriptions,
      structure,
      configured: is_enabled && node_name_set,
    };
  });

  const unreachable = instances
    .filter((i) => i.clustering.engine !== instance_cluster_engine)
    .map((i) => ({
      instance_name: i.instance_name,
      compute_stack_id: i.name,
    }));

  const connected = processedInstances.filter((i) => i.connection && i.configured);
  const unconnected = processedInstances.filter((i) => !i.connection && i.configured);
  const unconfigured = processedInstances.filter((i) => !i.configured);

  return {
    connected,
    unconnected,
    unconfigured,
    unreachable,
  };
};
