import queryLMS from '../queryLMS';

export default async ({ auth, user_id, customer_id, setLastUpdate }) => {
  const result = await queryLMS({
    endpoint: 'removeUser',
    method: 'POST',
    payload: { user_id, customer_id },
    auth,
  });
  setLastUpdate(Date.now());
  return result;
};
