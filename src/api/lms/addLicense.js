import queryLMS from '../queryLMS';

export default async ({ auth, payload: { instance_id, customer_id, stripe_product_id, fingerprint } }) => queryLMS({
  endpoint: 'addLicense',
  method: 'POST',
  payload: { instance_id, customer_id, stripe_product_id, fingerprint },
  auth,
});
