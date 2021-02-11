import queryLMS from '../queryLMS';

export default async ({ auth, email, customer_id }) =>
  queryLMS({
    endpoint: 'addUser',
    method: 'POST',
    payload: {
      email,
      customer_id,
      user_id: auth.user_id,
    },
    auth,
  });
