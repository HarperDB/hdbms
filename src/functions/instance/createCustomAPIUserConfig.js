import queryInstance from '../api/queryInstance';

export default async ({ username, auth, url }) =>
  queryInstance({
    operation: {
      operation: 'configure_cluster',
      CUSTOM_API_USER: username,
    },
    auth,
    url,
  });
