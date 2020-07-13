import queryInstance from '../queryInstance';

export default async ({ auth, url, compute_stack_id, customer_id }) =>
  queryInstance(
    {
      operation: 'restart',
      force: 'true',
    },
    auth,
    url,
    compute_stack_id,
    customer_id
  );
