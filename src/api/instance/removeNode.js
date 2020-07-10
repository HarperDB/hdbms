import queryInstance from '../queryInstance';

export default async ({ compute_stack_id, auth, url, is_local, customer_id }) =>
  queryInstance(
    {
      operation: 'remove_node',
      name: compute_stack_id,
    },
    auth,
    url,
    is_local,
    compute_stack_id,
    customer_id
  );
