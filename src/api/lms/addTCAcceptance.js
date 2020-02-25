import queryLMS from '../queryLMS';

export default async ({ auth, payload }) => queryLMS({
  endpoint: 'addTCAcceptance',
  method: 'POST',
  payload,
  auth,
});
