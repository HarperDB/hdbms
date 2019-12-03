const getInstanceNetworkStatus = async (instance, queryHarperDB) => {
  const clusterResponse = await queryHarperDB({ operation: 'cluster_status' }, instance);

  if (clusterResponse.message) {
    return {
      ...instance,
      fabric: {
        inbound_connections: [],
        outbound_connections: [],
        name: false,
      },
    };
  }

  const { status: { inbound_connections, outbound_connections, __originator } } = clusterResponse;

  return {
    ...instance,
    fabric: {
      inbound_connections: inbound_connections ? inbound_connections.filter((c) => c.host_address.indexOf('::ffff') === -1) : [],
      outbound_connections: outbound_connections ? outbound_connections.filter((c) => c.host_address.indexOf('::ffff') === -1) : [],
      name: __originator && Object.keys(__originator)[0],
    },
  };
};

export default async (instances, queryHarperDB) => Promise.all(instances.map((i) => getInstanceNetworkStatus(i, queryHarperDB)));
