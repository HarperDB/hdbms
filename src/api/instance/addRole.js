import queryInstance from '../queryInstance';

export default async ({ auth, url, role, permission, is_local, compute_stack_id, customer_id }) =>
  queryInstance(
    {
      operation: 'add_role',
      role,
      permission,
    },
    auth,
    url,
    is_local,
    compute_stack_id,
    customer_id
  );
