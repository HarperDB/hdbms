import queryLMS from '../queryLMS';

export default async ({ auth, payload: { payment_method_id, stripe_id } }) => {
  const response = await queryLMS({
    endpoint: 'addPaymentMethod',
    method: 'POST',
    payload: {
      payment_method_id,
      stripe_id,
    },
    auth,
  });

  return response.body;
};
