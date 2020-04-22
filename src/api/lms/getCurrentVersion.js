import queryLMS from '../queryLMS';

export default async ({ signal }) => {
  const response = await queryLMS({
    endpoint: 'getCurrentVersion',
    method: 'POST',
    signal,
  });

  return response.body;
};
