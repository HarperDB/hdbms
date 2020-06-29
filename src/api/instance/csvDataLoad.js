import queryInstance from '../queryInstance';

export default async ({ schema, table, csv_file, auth, url, is_local, compute_stack_id, customer_id }) =>
  queryInstance(
    {
      operation: 'csv_data_load',
      action: 'insert',
      transact_to_cluster: true,
      schema,
      table,
      data: csv_file,
    },
    auth,
    url,
    is_local,
    compute_stack_id,
    customer_id
  );
