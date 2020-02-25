import queryLMS from '../queryLMS';

export default async ({ auth }) => queryLMS({
  endpoint: 'getUser',
  method: 'POST',
  auth,
});
