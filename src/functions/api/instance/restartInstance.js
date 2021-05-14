import queryInstance from '../queryInstance';

export default async ({ auth, url }) =>
  queryInstance({
    operation: {
      operation: 'restart',
    },
    auth,
    url,
  });
