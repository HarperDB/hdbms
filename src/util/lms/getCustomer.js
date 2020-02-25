import queryLMS from './_queryLMS';

export default async ({ auth }) => queryLMS({
  endpoint: 'getCustomer',
  method: 'POST',
  auth,
});
