import queryInstance from '../queryInstance';

export default async ({ auth, url, schema, table, signal, is_local, compute_stack_id, customer_id }) =>
  queryInstance({ operation: 'describe_table', schema, table }, auth, url, is_local, compute_stack_id, customer_id, signal);
