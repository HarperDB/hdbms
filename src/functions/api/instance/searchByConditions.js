import queryInstance from '../queryInstance';
export default async ({
  auth,
  url,
  schema,
  table,
  operator,
  getAttributes,
  limit,
  offset,
  conditions,
  signal
}) => queryInstance({
  operation: {
    operation: 'search_by_conditions',
    schema,
    table,
    operator,
    getAttributes,
    limit,
    offset,
    conditions
  },
  auth,
  url,
  signal
});