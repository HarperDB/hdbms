import queryLMS from '../queryLMS';

export default async ({ auth }) => queryLMS({
  endpoint: 'getCustomer',
  method: 'POST',
  auth,
});
