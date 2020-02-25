import queryLMS from './_queryLMS';

export default async ({ auth, payload }) => queryLMS({
  endpoint: 'removePaymentMethod',
  method: 'POST',
  payload,
  auth,
});
