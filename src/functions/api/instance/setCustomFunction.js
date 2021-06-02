import queryInstance from '../queryInstance';

export default async ({ auth, url, function_name, function_content }) =>
  queryInstance({
    operation: { operation: 'set_custom_function', function_name, function_content },
    auth,
    url,
  });
