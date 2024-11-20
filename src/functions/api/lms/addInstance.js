import queryLMS from '../queryLMS';
export default async props => queryLMS({
  endpoint: props.cloudProvider === 'verizon' ? 'wl/addWavelengthInstance' : props.cloudProvider === 'akamai' ? 'addAkamaiInstance' : 'v2/addInstance',
  method: 'POST',
  auth: props.auth,
  payload: Object.entries({
    userId: props.auth.userId,
    customerId: props.customerId,
    instanceName: props.instanceName,
    isLocal: props.isLocal,
    isWavelength: props.isWavelength,
    isAkamai: props.isAkamai,
    isSsl: props.isSsl,
    host: props.host,
    loginDomain: props.loginDomain || window.location.host,
    port: props.port,
    instanceRegion: props.instanceRegion,
    wavelengthZoneId: props.instanceRegion,
    instanceType: props.instanceType,
    stripePlanId: props.stripePlanId,
    dataVolumeSize: props.dataVolumeSize,
    stripeStoragePlanId: props.stripeStoragePlanId,
    computeSubscriptionId: props.computeSubscriptionId,
    storageSubscriptionId: props.storageSubscriptionId,
    cloudProvider: props.cloudProvider
  }).reduce((a, [k, v]) => v == null ? a : (a[k] = v, a), {})
});