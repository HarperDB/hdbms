import queryLMS from '../queryLMS';

export default async ({ auth, payload }) => queryLMS({
  endpoint: 'addPaymentMethod',
  method: 'POST',
  payload,
  auth,
});
