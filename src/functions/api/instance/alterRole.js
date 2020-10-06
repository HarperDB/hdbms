import queryInstance from '../queryInstance';

export default async ({ auth, url, id, permission, compute_stack_id, customer_id }) =>
  queryInstance(
    {
      operation: 'alter_role',
      id,
      permission,
    },
    auth,
    url,
    compute_stack_id,
    customer_id
  );
