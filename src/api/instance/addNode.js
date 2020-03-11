import queryInstance from '../queryInstance';

export default async ({ id, host, clusterPort, auth, refreshInstance, url }) => {
  await queryInstance({ operation: 'remove_node', name: id }, auth, url);
  await queryInstance({ operation: 'add_node', name: id, host, port: clusterPort, subscriptions: [] }, auth, url);
  return setTimeout(() => refreshInstance(Date.now()), 100);
};
