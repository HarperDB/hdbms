import queryLMS from './_queryLMS';

export default async ({ auth }) => queryLMS({
  endpoint: 'getUser',
  method: 'POST',
  auth,
});
