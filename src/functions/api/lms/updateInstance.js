import queryLMS from '../queryLMS';
export default async props => queryLMS({
  endpoint: 'updateInstance',
  method: 'POST',
  payload: Object.entries({
    stripePlanId: props.stripePlanId,
    computeStackId: props.computeStackId,
    customerId: props.customerId,
    dataVolumeSize: props.dataVolumeSize,
    stripeStoragePlanId: props.stripeStoragePlanId,
    computeSubscriptionId: props.computeSubscriptionId,
    storageSubscriptionId: props.storageSubscriptionId
  }).reduce((a, [k, v]) => v == null ? a : (a[k] = v, a), {}),
  auth: props.auth
});