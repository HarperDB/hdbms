import queryInstance from '../queryInstance';
export default async ({
  schema,
  table,
  csvFile,
  auth,
  url
}) => queryInstance({
  operation: {
    operation: 'csv_data_load',
    action: 'insert',
    transactToCluster: true,
    schema,
    table,
    data: csvFile
  },
  auth,
  url
});