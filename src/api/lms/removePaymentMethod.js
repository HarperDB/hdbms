import queryLMS from '../queryLMS';

export default async ({ auth, payload }) => queryLMS({
  endpoint: 'removePaymentMethod',
  method: 'POST',
  payload,
  auth,
});
