import queryLMS from '../queryLMS';

export default async ({ auth, payload: { firstname, lastname, customer_id, user_id } }) => {
  const response = await queryLMS({
    endpoint: 'updateUser',
    method: 'POST',
    payload: { firstname, lastname, customer_id, user_id },
    auth,
  });
  return response.body;
};
