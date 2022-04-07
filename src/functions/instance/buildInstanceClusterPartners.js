export default ({ instances, network, instance_region, instance_wavelength_zone_id }) => {
  const registered = instances
    .filter((i) => i.url && i.status !== 'DELETE_IN_PROGRESS')
    .map((i) => {
      const connection = network?.outbound_connections.find((n) => n.name === i.compute_stack_id);
      const subscriptions = connection?.subscriptions || [];
      const clusterPort = 12345;
      const { instance_name, is_local, compute_stack_id } = i;
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
      };
    });

  const unregistered = network.outbound_connections
    .filter((c) => !registered.find((r) => r.instance_host === c.host && r.compute_stack_id === c.name))
    .map((i) => ({
      instance_name: i.host,
      compute_stack_id: i.name,
    }));

  return {
    connected: registered.filter((i) => i.connection),
    unconnected: registered.filter((i) => !i.connection),
    unregistered,
  };
};
