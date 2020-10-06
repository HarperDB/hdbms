import queryInstance from '../queryInstance';

export default async ({ auth, url, id, compute_stack_id, customer_id }) => queryInstance({ operation: 'get_job', id }, auth, url, compute_stack_id, customer_id);
