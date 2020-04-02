import queryInstance from '../queryInstance';

export default async ({ auth, url, id }) => {
  const result = await queryInstance({ operation: 'get_job', id }, auth, url);
  try {
    const [{ status }] = result;
    return status;
  } catch (e) {
    return 'ERROR';
  }
};
