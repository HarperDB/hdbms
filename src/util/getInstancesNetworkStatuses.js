const getInstanceNetworkStatus = async (instance, queryHarperDB) => {
  const { status: { inbound_connections, outbound_connections, __originator } } = await queryHarperDB({ operation: 'cluster_status' }, instance);
  return {
    ...instance,
    fabric: {
      inbound_connections: inbound_connections ? inbound_connections.filter((c) => c.host_address.indexOf('::ffff') === -1) : [],
      outbound_connections: outbound_connections ? outbound_connections.filter((c) => c.host_address.indexOf('::ffff') === -1) : [],
      name: Object.keys(__originator)[0],
    },
  };
};

export default async (instances, queryHarperDB) => Promise.all(instances.map((i) => getInstanceNetworkStatus(i, queryHarperDB)));
