import queryLMS from '../queryLMS';

export default async ({ auth, payment_method_id, stripe_id }) => {
  const response = await queryLMS({
    endpoint: 'removePaymentMethod',
    method: 'POST',
    payload: {
      payment_method_id,
      stripe_id,
    },
    auth,
  });

  return response;
};
