import queryLMS from '../queryLMS';

export default async ({ auth, payload }) => queryLMS({
  endpoint: 'removeInstance',
  method: 'POST',
  payload,
  auth,
});
