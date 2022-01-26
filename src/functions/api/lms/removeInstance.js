import queryLMS from '../queryLMS';

export default async ({ auth, customer_id, compute_stack_id, wavelength_zone_id }) =>
  queryLMS({
    endpoint: wavelength_zone_id ? 'wl/removeWavelengthInstance' : 'removeInstance',
    method: 'POST',
    payload: {
      customer_id,
      compute_stack_id,
    },
    auth,
  });
