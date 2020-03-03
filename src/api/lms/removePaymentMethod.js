import queryLMS from '../queryLMS';

export default async ({ auth, payload: { customer_id, stripe_card_id, customer_stripe_id } }) => {
  const response = await queryLMS({
    endpoint: 'removePaymentMethod',
    method: 'POST',
    payload: { customer_id, stripe_card_id, customer_stripe_id },
    auth,
  });

  return response.body;
};
