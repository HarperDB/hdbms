import queryInstance from '../queryInstance';

export default async ({ auth, username, url, compute_stack_id, customer_id }) => queryInstance({ operation: 'drop_user', username }, auth, url, compute_stack_id, customer_id);
