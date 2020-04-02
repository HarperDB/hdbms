import queryInstance from '../queryInstance';

export default async ({ schema, table, data, auth, url }) =>
  queryInstance(
    {
      operation: 'csv_data_load',
      action: 'insert',
      transact_to_cluster: true,
      schema,
      table,
      data,
    },
    auth,
    url
  );
