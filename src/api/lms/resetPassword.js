import queryLMS from '../queryLMS';

export default async ({ payload: { email } }) => {
  const response = await queryLMS({
    endpoint: 'resetPassword',
    method: 'POST',
    payload: { email },
    auth: { user: 'david@harperdb.io', pass: 'harperdb' },
  });
  return response.body;
};
