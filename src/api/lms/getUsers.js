import queryLMS from '../queryLMS';

export default async ({ auth }) => queryLMS({
  endpoint: 'getUsers',
  method: 'POST',
  auth,
});
