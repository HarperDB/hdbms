import queryInstance from '../queryInstance';

export default async ({ compute_stack_id, instance_host, clusterPort, auth, url, is_local, customer_id }) =>
  queryInstance(
    {
      operation: 'add_node',
      name: compute_stack_id,
      host: instance_host,
      port: clusterPort,
      subscriptions: [],
    },
    auth,
    url,
    is_local,
    compute_stack_id,
    customer_id
  );
