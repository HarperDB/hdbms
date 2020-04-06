import queryInstance from '../queryInstance';

export default async ({ auth, url }) =>
  queryInstance(
    {
      operation: 'restart',
      force: 'true',
    },
    auth,
    url
  );
