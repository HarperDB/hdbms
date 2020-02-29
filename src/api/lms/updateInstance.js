import queryLMS from '../queryLMS';

export default async ({ auth, instance_name, stripe_product_id, instance_id, customer_id, storage_qty_gb }) => queryLMS({
  endpoint: 'updateInstance',
  method: 'POST',
  payload: { stripe_product_id, instance_id, customer_id, instance_name, storage_qty_gb },
  auth,
});
