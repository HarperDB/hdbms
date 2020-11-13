import addUser from '../api/instance/addUser';

export default async ({ username, password, role, auth, url, is_local, compute_stack_id, customer_id }) =>
  addUser({ username, password, role, auth, url, is_local, compute_stack_id, customer_id });
