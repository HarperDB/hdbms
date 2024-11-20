import queryLMS from '../queryLMS';
export default async ({
  auth,
  paymentMethodId,
  stripeId,
  customerId
}) => queryLMS({
  endpoint: 'addPaymentMethod',
  method: 'POST',
  payload: {
    paymentMethodId,
    stripeId,
    customerId
  },
  auth
});