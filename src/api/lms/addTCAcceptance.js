import queryLMS from '../queryLMS';

export default async ({ auth, payload }) => {
  const response = await queryLMS({
    endpoint: 'addTCAcceptance',
    method: 'POST',
    payload,
    auth,
  });

  return response.body;
};
