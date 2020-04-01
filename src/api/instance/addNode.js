import queryInstance from '../queryInstance';
import instanceState from '../../state/stores/instanceState';

export default async ({ instance_name, instance_host, clusterPort, auth, url }) => {
  await queryInstance(
    {
      operation: 'add_node',
      name: instance_name,
      host: instance_host,
      port: clusterPort,
      subscriptions: [],
    },
    auth,
    url
  );
  return instanceState.update((s) => {
    s.lastUpdate = Date.now();
  });
};
