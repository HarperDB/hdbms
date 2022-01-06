import queryInstance from '../queryInstance';

export default async ({ auth, url, schema, table, search_attribute, search_value, get_attributes, limit, offset, signal }) =>
  queryInstance({
    operation: { operation: 'search_by_value', schema, table, search_attribute, search_value, get_attributes, limit, offset },
    auth,
    url,
    signal,
  });
