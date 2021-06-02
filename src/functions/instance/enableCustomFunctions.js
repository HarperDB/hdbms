import queryInstance from '../api/queryInstance';

export default async ({ auth, url }) =>
  queryInstance({
    operation: {
      operation: 'configure_cluster',
      CUSTOM_FUNCTIONS: true,
    },
    auth,
    url,
  });
