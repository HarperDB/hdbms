import queryInstance from '../queryInstance';

export default async ({ auth, url, compute_stack_id, customer_id }) => queryInstance({ operation: 'list_users' }, auth, url, compute_stack_id, customer_id);