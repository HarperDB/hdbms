import queryInstance from '../queryInstance';

export default async ({ auth, role, username, password, url, compute_stack_id, customer_id }) =>
  queryInstance(
    {
      operation: 'add_user',
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
