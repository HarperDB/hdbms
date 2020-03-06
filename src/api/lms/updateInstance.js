import queryLMS from '../queryLMS';

export default async ({ auth, payload: { instance_name, stripe_product_id, instance_id, customer_id, data_volume_size } }) => {
  const response = await queryLMS({
    endpoint: 'updateInstance',
    method: 'POST',
    payload: { stripe_product_id, instance_id, customer_id, instance_name, data_volume_size },
    auth,
  });

  return response.body;
};
