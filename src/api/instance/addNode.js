import queryInstance from '../queryInstance';
import instanceState from '../../state/stores/instanceState';

export default async ({ compute_stack_id, instance_host, clusterPort, auth, url }) => {
  await queryInstance(
    {
      operation: 'add_node',
      name: compute_stack_id,
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
