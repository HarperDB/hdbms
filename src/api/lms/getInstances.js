import queryLMS from '../queryLMS';

export default async ({ auth, payload: { customer_id }, entities: { products, regions, licenses } }) => {
  const response = await queryLMS({
    endpoint: 'getInstances',
    method: 'POST',
    payload: { customer_id },
    auth,
  });

  return response.body.map((i) => ({
    ...i,
    compute: products[i.is_local ? 'localCompute' : 'cloudCompute'].find((p) => p.value === i.stripe_plan_id),
    storage: i.is_local ? false : products.cloudStorage.find((p) => p.value === i.storage_qty_gb),
    region: i.is_local ? false : regions.find((r) => r.value === i.instance_region),
    license: Array.isArray(licenses) ? licenses.find((l) => l.instance_id === i.id) : [],
  }));
};
