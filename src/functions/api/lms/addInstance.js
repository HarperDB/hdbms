import queryLMS from '../queryLMS';

export default async (props) =>
  queryLMS({
    endpoint: 'v2/addInstance',
    method: 'POST',
    payload: Object.entries({
      user_id: props.auth.user_id,
      customer_id: props.customer_id,
      instance_name: props.instance_name,
      is_local: props.is_local,
      is_ssl: props.is_ssl,
      host: props.host,
      port: props.port,
      instance_region: props.instance_region,
      instance_type: props.instance_type,
      stripe_plan_id: props.stripe_plan_id,
      data_volume_size: props.data_volume_size,
      stripe_storage_plan_id: props.stripe_storage_plan_id,
      compute_subscription_id: props.compute_subscription_id,
      storage_subscription_id: props.storage_subscription_id,
    }).reduce((a, [k, v]) => (v == null ? a : ((a[k] = v), a)), {}),
    auth: props.auth,
  });
