import queryInstance from '../queryInstance';

export default async ({ auth, url, sql, compute_stack_id, customer_id }) => queryInstance({ operation: 'sql', sql }, auth, url, compute_stack_id, customer_id);
