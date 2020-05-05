import queryLMS from '../queryLMS';

export default async ({ auth, firstname, lastname, email, customer_id }) =>
  queryLMS({
    endpoint: 'addUser',
    method: 'POST',
    payload: {
      firstname,
      lastname,
      email,
      customer_id,
    },
    auth,
  });
