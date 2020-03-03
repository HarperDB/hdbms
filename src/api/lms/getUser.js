import queryLMS from '../queryLMS';

export default async ({ auth, payload: { email } }) => {
  const response = await queryLMS({
    endpoint: 'getUser',
    method: 'POST',
    payload: { email },
    auth,
  });

  return response.body;
};
