import queryLMS from '../queryLMS';

export default async ({ auth, payload: { stripe_plan_id, compute_stack_id, customer_id, data_volume_size } }) => {
  const response = await queryLMS({
    endpoint: 'updateInstance',
    method: 'POST',
    payload: {
      stripe_plan_id,
      compute_stack_id,
      customer_id,
      data_volume_size,
    },
    auth,
  });

  return response.body;
};
