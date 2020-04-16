export default ({ instances, network }) => {
  const registered = instances
    .filter((i) => i.status !== 'DELETE_IN_PROGRESS')
    .map((i) => {
      const connection = network?.outbound_connections.find((n) => n.name === i.compute_stack_id);
      const subscriptions = connection?.subscriptions || [];
      const clusterPort = 12345;
      const { instance_name, is_local, host, compute_stack_id } = i;
      const instance_status = is_local ? 'OK' : i.status;
      const instance_host = host;
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
