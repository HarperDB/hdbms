import queryInstance from '../queryInstance';

export default async ({ auth, url, username, password = undefined, role = undefined, compute_stack_id, customer_id }) =>
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
    compute_stack_id,
    customer_id
  );
