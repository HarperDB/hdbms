import queryLMS from '../queryLMS';

export default async ({ auth, payload }) => {
  const response = await queryLMS({
    endpoint: 'addUser',
    method: 'POST',
    payload,
    auth,
  });

  return response.body;
};
