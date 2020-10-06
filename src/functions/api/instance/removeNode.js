import queryInstance from '../queryInstance';

export default async ({ compute_stack_id, auth, url, customer_id }) =>
  queryInstance(
    {
      operation: 'remove_node',
      name: compute_stack_id,
    },
    auth,
    url,
    compute_stack_id,
    customer_id
  );
