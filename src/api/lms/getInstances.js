import queryLMS from '../queryLMS';
import appState from '../../state/stores/appState';

export default async ({ auth, payload: { customer_id }, entities: { products, regions, licenses } }) => {
  const response = await queryLMS({
    endpoint: 'getInstances',
    method: 'POST',
    payload: { customer_id },
    auth,
  });

  let instances = [];

  if (Array.isArray(response.body)) {
    instances = response.body.map((i) => ({
      ...i,
      compute: products[i.is_local ? 'localCompute' : 'cloudCompute'].find((p) => p.value === i.stripe_plan_id),
      storage: i.is_local ? false : products.cloudStorage.find((p) => p.value === i.data_volume_size),
      region: i.is_local ? false : regions.find((r) => r.value === i.instance_region),
      license: Array.isArray(licenses) ? licenses.find((l) => l.compute_stack_id === i.id) : [],
    }));
  }

  return appState.update((s) => { s.instances = instances; });
};
