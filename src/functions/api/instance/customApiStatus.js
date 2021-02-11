import queryInstance from '../queryInstance';

export default async ({ auth, url }) =>
  queryInstance({
    operation: { operation: 'custom_api_status' },
    auth,
    url,
  });
