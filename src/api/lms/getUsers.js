import queryLMS from '../queryLMS';

export default async ({ auth, payload: { customer_id } }) => {
  const response = await queryLMS({
    endpoint: 'getUsers',
    method: 'POST',
    payload: { customer_id },
    auth,
  });

  return response.body;
};
