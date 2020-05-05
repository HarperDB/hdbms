import queryLMS from '../queryLMS';

export default async ({ auth, firstname, lastname, customer_id, user_id }) =>
  queryLMS({
    endpoint: 'updateUser',
    method: 'POST',
    payload: {
      firstname,
      lastname,
      customer_id,
      user_id,
    },
    auth,
  });
