import queryLMS from '../queryLMS';

export default async ({ auth, stripe_plan_id, compute_stack_id, customer_id, data_volume_size, stripe_storage_plan_id }) =>
  queryLMS({
    endpoint: 'updateInstance',
    method: 'POST',
    payload: {
      stripe_plan_id,
      compute_stack_id,
      customer_id,
      data_volume_size,
      stripe_storage_plan_id,
    },
    auth,
  });
