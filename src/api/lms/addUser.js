import queryLMS from '../queryLMS';

export default async ({ auth, payload }) => queryLMS({
  endpoint: 'addUser',
  method: 'POST',
  payload,
  auth,
});
