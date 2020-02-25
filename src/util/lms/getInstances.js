import queryLMS from './_queryLMS';

export default async ({ auth }) => queryLMS({
  endpoint: 'getInstances',
  method: 'POST',
  auth,
});
