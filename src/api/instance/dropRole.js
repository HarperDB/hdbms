import queryInstance from '../queryInstance';

export default async ({ auth, id, url, compute_stack_id, customer_id }) => queryInstance({ operation: 'drop_role', id }, auth, url, compute_stack_id, customer_id);
