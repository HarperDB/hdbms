import queryInstance from '../queryInstance';

export default async ({ auth, id, url, is_local, compute_stack_id, customer_id }) =>
  queryInstance({ operation: 'drop_role', id }, auth, url, is_local, compute_stack_id, customer_id);
