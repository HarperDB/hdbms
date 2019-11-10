const getInstanceNetworkStatus = async (instance, queryHarperDB) => {
  const { status: { inbound_connections, outbound_connections, __originator } } = await queryHarperDB({ operation: 'cluster_status' }, instance);
  return { ...instance, fabric: { inbound_connections, outbound_connections, name: Object.keys(__originator)[0] } };
};

export default async (instances, queryHarperDB) => Promise.all(instances.map((i) => getInstanceNetworkStatus(i, queryHarperDB)));
