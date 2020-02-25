import queryLMS from './_queryLMS';

export default async ({ auth }) => queryLMS({
  endpoint: 'getCustomerInvoices',
  method: 'POST',
  auth,
});
