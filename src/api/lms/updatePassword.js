import queryLMS from '../queryLMS';

export default async ({ auth, user_id, password }) =>
  queryLMS({
    endpoint: 'updatePassword',
    method: 'POST',
    payload: { user_id, password },
    auth,
  });
