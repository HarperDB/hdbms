import queryInstance from './queryInstance';

export default async ({ id, host, clusterPort, auth, refreshInstance }) => {
  await queryInstance({ operation: 'remove_node', name: id }, auth);
  await queryInstance({ operation: 'add_node', name: id, host, port: clusterPort, subscriptions: [] }, auth);
  return setTimeout(() => refreshInstance(Date.now()), 100);
};
