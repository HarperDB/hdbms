import queryLMS from './queryLMS';

export default async ({ auth }) => queryLMS({
  endpoint: 'getInstances',
  method: 'POST',
  auth,
});
