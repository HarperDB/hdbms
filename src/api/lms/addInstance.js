import queryLMS from '../queryLMS';

export default async (props) =>
  queryLMS({
    endpoint: 'addInstance',
    method: 'POST',
    payload: {
      customer_id: props.customer_id,
      instance_name: props.instance_name,
      is_local: props.is_local,
      is_ssl: props.is_ssl,
      instance_region: props.instance_region,
      instance_type: props.instance_type,
      stripe_plan_id: props.stripe_plan_id,
      compute_subscription_id: props.compute_subscription_id,
      data_volume_size: props.data_volume_size,
      stripe_storage_plan_id: props.stripe_storage_plan_id,
      storage_subscription_id: props.storage_subscription_id,
    },
    auth: props.auth,
  });
