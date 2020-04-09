import queryInstance from '../queryInstance';

export default async ({ auth, url }) => {
  const { file, dailyRotateFile } = await queryInstance(
    {
      operation: 'read_log',
      limit: 1000,
      order: 'desc',
    },
    auth,
    url
  );

  return file || dailyRotateFile || false;
};
