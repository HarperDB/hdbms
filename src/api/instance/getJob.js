import queryInstance from '../queryInstance';

export default async ({ auth, url, id, is_local, compute_stack_id, customer_id }) =>
  queryInstance({ operation: 'get_job', id }, auth, url, is_local, compute_stack_id, customer_id);
