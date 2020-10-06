import queryInstance from '../queryInstance';

export default async ({ auth, url, role, permission, compute_stack_id, customer_id }) =>
  queryInstance(
    {
      operation: 'add_role',
      role,
      permission,
    },
    auth,
    url,
    compute_stack_id,
    customer_id
  );
