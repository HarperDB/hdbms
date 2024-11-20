import queryInstance from '../queryInstance';
export default async ({
  auth,
  url,
  schema,
  table,
  searchAttribute,
  searchValue,
  getAttributes,
  limit,
  offset,
  signal
}) => queryInstance({
  operation: {
    operation: 'search_by_value',
    schema,
    table,
    searchAttribute,
    searchValue,
    getAttributes,
    limit,
    offset
  },
  auth,
  url,
  signal
});