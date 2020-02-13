import queryInstance from './queryInstance';

export default async ({ id, host, clusterPort, auth }) => {
  await queryInstance({ operation: 'remove_node', name: id }, auth);
  return queryInstance({ operation: 'add_node', name: id, host, port: clusterPort, subscriptions: [] }, auth);
};
