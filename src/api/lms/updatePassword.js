import queryLMS from '../queryLMS';

export default async ({ auth, payload: { email, customer_id, password } }) => {
  const response = await queryLMS({
    endpoint: 'updatePassword',
    method: 'POST',
    payload: { email, customer_id, password },
    auth,
  });
  return response.body;
};
