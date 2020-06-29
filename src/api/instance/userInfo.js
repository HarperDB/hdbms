import queryInstance from '../queryInstance';

export default async ({ auth, url, is_local, compute_stack_id, customer_id }) => queryInstance({ operation: 'user_info' }, auth, url, is_local, compute_stack_id, customer_id);
