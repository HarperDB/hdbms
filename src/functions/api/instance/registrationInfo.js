import queryInstance from '../queryInstance';

export default async ({ auth, url, compute_stack_id, customer_id }) => queryInstance({ operation: 'registration_info' }, auth, url, compute_stack_id, customer_id);
