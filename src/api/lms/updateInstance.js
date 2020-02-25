import queryLMS from '../queryLMS';

export default async ({ auth, instance_name, stripe_product_id, instance_id, customer_id }) => queryLMS({
  endpoint: 'updateInstance',
  method: 'POST',
  payload: { stripe_product_id, instance_id, customer_id },
  auth,
});
