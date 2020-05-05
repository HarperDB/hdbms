import queryLMS from '../queryLMS';

export default async ({ email, pass }) =>
  queryLMS({
    endpoint: 'getUser',
    method: 'POST',
    payload: { email, password: pass },
  });
