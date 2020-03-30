import queryLMS from '../queryLMS';
import appState from '../../state/stores/appState';

export default async ({ auth, payload: { customer_id }, entities: { products, regions } }) => {
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
    }));
  }

  return appState.update((s) => { s.instances = instances.filter((i) => !['DELETE_COMPLETE', 'DELETE_IN_PROGRESS'].includes(i.status)).sort((a, b) => (a.instance_name > b.instance_name ? 1 : -1)); });
};
