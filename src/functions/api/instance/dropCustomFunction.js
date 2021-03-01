import queryInstance from '../queryInstance';

export default async ({ auth, url, function_name }) =>
  queryInstance({
    operation: { operation: 'drop_custom_function', function_name },
    auth,
    url,
  });
