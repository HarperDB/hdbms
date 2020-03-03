import queryInstance from '../queryInstance';

export default async ({ schema, table, data, auth }) => queryInstance({ operation: 'csv_data_load', action: 'insert', schema, table, data }, auth);
