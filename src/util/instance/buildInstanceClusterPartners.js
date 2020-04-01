export default ({ instances, network }) => {
  const registered = instances.map((i) => {
    const connection = network?.outbound_connections.find((n) => n.name === i.instance_name);
    const subscriptions = connection?.subscriptions || [];
    const clusterPort = 12345;
    const { instance_name, ip_address, is_local, host } = i;
    const instance_status = is_local ? 'OK' : i.status;
    const instance_host = host || ip_address;
    const reachable = instance_status !== 'CREATE_IN_PROGRESS' && !['localhost', '127.0.0.1'].includes(instance_host);
    return {
      instance_name,
      instance_url: i.url,
      instance_status,
      instance_host,
      clusterPort,
      connection,
      subscriptions,
      reachable,
    };
  });

  const unregistered = network.outbound_connections
    .filter((c) => !registered.find((r) => r.instance_host === c.host))
    .map((i) => ({
      instance_name: i.name,
    }));

  return {
    connected: registered.filter((i) => i.connection && i.reachable),
    unconnected: registered.filter((i) => !i.connection && i.reachable),
    unreachable: registered.filter((i) => !i.reachable),
    unregistered,
  };
};
