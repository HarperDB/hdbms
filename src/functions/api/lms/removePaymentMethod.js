import queryLMS from '../queryLMS';
export default async ({
  auth,
  paymentMethodId,
  stripeId,
  customerId
}) => queryLMS({
  endpoint: 'removePaymentMethod',
  method: 'POST',
  payload: {
    paymentMethodId,
    stripeId,
    customerId
  },
  auth
});