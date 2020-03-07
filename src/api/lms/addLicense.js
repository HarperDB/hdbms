import queryLMS from '../queryLMS';

export default async ({ auth, payload: { compute_stack_id, customer_id, stripe_product_id, fingerprint } }) => {
  const response = await queryLMS({
    endpoint: 'addLicense',
    method: 'POST',
    payload: { compute_stack_id, customer_id, stripe_product_id, fingerprint },
    auth,
  });

  return response.body;
};
