import queryInstance from '../queryInstance';
export default async ({
  schema,
  table,
  csvUrl,
  auth,
  url
}) => queryInstance({
  operation: {
    operation: 'csv_url_load',
    action: 'insert',
    transactToCluster: true,
    schema,
    table,
    csvUrl
  },
  auth,
  url
});