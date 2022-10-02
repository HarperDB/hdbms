export default ({ instances, network, instance_region, instance_wavelength_zone_id, instance_cluster_engine }) => {
  const registered = instances
    .filter((i) => i.url && i.status !== 'DELETE_IN_PROGRESS')
    .map((i) => {
      const { instance_name, is_local, compute_stack_id, clusterEngine } = i;
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
        compatible: clusterEngine === instance_cluster_engine,
      };
    });

  const incompatible = instances
  .filter((i) => i.clusterEngine !== instance_cluster_engine)
  .map((i) => ({
    instance_name: `v${i.version} - ${i.instance_name}`,
    compute_stack_id: i.name,
  }));

  return {
    connected: registered.filter((i) => i.compatible && i.connection),
    unconnected: registered.filter((i) => i.compatible && !i.connection),
    incompatible,
  };
};
