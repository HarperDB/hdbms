import queryInstance from '../queryInstance';

export default async ({ auth, url }) =>
  queryInstance({
    operation: {
      operation: 'restart',
      force: 'true',
    },
    auth,
    url,
  });
