import queryInstance from '../queryInstance';

export default async ({ auth, url }) =>
  queryInstance(
    {
      operation: 'restart',
    },
    auth,
    url
  );
