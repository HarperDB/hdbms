import queryLMS from '../queryLMS';

export default async ({ auth, payload: { user_id, password } }) => {
  const response = await queryLMS({
    endpoint: 'updatePassword',
    method: 'POST',
    payload: { user_id, password },
    auth,
  });
  return response.body;
};
