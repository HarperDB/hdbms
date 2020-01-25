import queryInstance from './queryInstance';

export default async (auth) => {
  const clusterResponse = await queryInstance({ operation: 'cluster_status' }, auth);

  if (clusterResponse.message) {
    return {
      inbound_connections: [],
      outbound_connections: [],
      name: false,
    };
  }

  const { status: { inbound_connections, outbound_connections, __originator } } = clusterResponse;

  return {
    inbound_connections: inbound_connections ? inbound_connections.filter((c) => c.host_address.indexOf('::ffff') === -1) : [],
    outbound_connections: outbound_connections ? outbound_connections.filter((c) => c.host_address.indexOf('::ffff') === -1) : [],
    name: __originator && Object.keys(__originator)[0],
  };
};
