import queryLMS from '../queryLMS';

export default async ({ auth }) => queryLMS({
  endpoint: 'getInvoices',
  method: 'POST',
  auth,
});
