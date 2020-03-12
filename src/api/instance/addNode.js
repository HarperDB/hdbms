import queryInstance from '../queryInstance';

export default async ({ instance_name, instance_host, clusterPort, auth, refreshInstance, url }) => {
  await queryInstance({ operation: 'remove_node', name: instance_name }, auth, url);
  await queryInstance({ operation: 'add_node', name: instance_name, host: instance_host, port: clusterPort, subscriptions: [] }, auth, url);
  return setTimeout(() => refreshInstance(Date.now()), 100);
};
