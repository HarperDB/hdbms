import queryInstance from '../queryInstance';

export default async ({ auth, url, username, password = undefined, role = undefined, is_local, compute_stack_id, customer_id }) =>
  queryInstance(
    {
      operation: 'alter_user',
      role,
      username,
      password,
      active: true,
    },
    auth,
    url,
    is_local,
    compute_stack_id,
    customer_id
  );
