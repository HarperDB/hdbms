import queryLMS from '../queryLMS';

export default async ({ auth, payload: { payment_method_id, stripe_customer_id } }) => {
  const response = await queryLMS({
    endpoint: 'addPaymentMethod',
    method: 'POST',
    payload: { payment_method_id, stripe_customer_id },
    auth,
  });

  return response.body;
};
