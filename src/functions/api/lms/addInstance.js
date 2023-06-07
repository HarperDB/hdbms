import queryLMS from '../queryLMS';

export default async ({ cloud_provider, auth, instance_region, ...rest }) =>
  queryLMS({
    endpoint: cloud_provider === 'verizon' ? 'wl/addWavelengthInstance' : cloud_provider === 'akamai' ? '/addAkamaiInstance' : 'v2/addInstance',
    method: 'POST',
    auth,
    payload: Object.entries({
      user_id: auth.user_id,
      wavelength_zone_id: instance_region,
      ...rest,
    }).reduce((a, [k, v]) => (v == null ? a : ((a[k] = v), a)), {}),
  });
