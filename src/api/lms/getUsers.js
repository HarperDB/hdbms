import queryLMS from '../queryLMS';

export default async ({ auth }) => {
  const response = await queryLMS({
    endpoint: 'getUsers',
    method: 'POST',
    auth,
  });

  return response.body;
};
