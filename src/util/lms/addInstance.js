import queryLMS from './_queryLMS';

export default async ({ auth, payload }) => queryLMS({
  endpoint: 'addInstance',
  method: 'POST',
  payload,
  auth,
});
