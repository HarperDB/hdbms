import queryLMS from '../queryLMS';

export default async ({ auth, payload: { license_id, instance_id, customer_id, stripe_product_id, fingerprint } }) => {
  const response = await queryLMS({
    endpoint: 'updateLicense',
    method: 'POST',
    payload: { license_id, instance_id, customer_id, stripe_product_id, fingerprint },
    auth,
  });

  return response.body;
}
