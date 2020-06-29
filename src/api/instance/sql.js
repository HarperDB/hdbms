import queryInstance from '../queryInstance';

export default async ({ auth, url, sql, is_local, compute_stack_id, customer_id }) => queryInstance({ operation: 'sql', sql }, auth, url, is_local, compute_stack_id, customer_id);
