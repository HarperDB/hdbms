import queryLMS from '../queryLMS';

export default async ({ auth, user_id, customer_id }) =>
  queryLMS({
    endpoint: 'removeUser',
    method: 'POST',
    payload: { user_id, customer_id },
    auth,
  });
