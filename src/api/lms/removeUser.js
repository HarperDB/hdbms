import queryLMS from '../queryLMS';

export default async ({ auth, payload: { user_id, customer_id, setLastUpdate } }) => {
  const response = await queryLMS({
    endpoint: 'removeUser',
    method: 'POST',
    payload: { user_id, customer_id },
    auth,
  });
  setLastUpdate(Date.now());
  return response.body;
};
