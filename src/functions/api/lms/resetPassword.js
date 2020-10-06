import queryLMS from '../queryLMS';

export default async ({ email }) =>
  queryLMS({
    endpoint: 'resetPassword',
    method: 'POST',
    payload: { email },
  });
