import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import commaNumbers from '../../methods/util/commaNumbers';

export default async ({ auth, customer_id, products, regions, instanceCount }) => {
  const response = await queryLMS({
    endpoint: 'getInstances',
    method: 'POST',
    payload: {
      customer_id,
      user_id: auth.user_id,
    },
    auth,
  });

  if (Array.isArray(response)) {
    const instances = response.map((i) => {
      const thisInstance = i;
      const computePlans = products[thisInstance.is_local ? 'localCompute' : 'cloudCompute'];
      const compute = computePlans && computePlans.find((p) => p.value === thisInstance.stripe_plan_id);
      const storage = thisInstance.is_local ? false : products.cloudStorage && products.cloudStorage.find((p) => p.value === thisInstance.data_volume_size);
      const totalPrice = parseFloat(compute?.price || 0) + parseFloat(storage?.price || 0);

      return {
        ...thisInstance,
        compute,
        computeProducts: products[thisInstance.is_local ? 'localCompute' : 'cloudCompute'],
        storage,
        storageProducts: thisInstance.is_local ? false : products.cloudStorage,
        totalPrice,
        totalPriceString: totalPrice ? `$${commaNumbers(totalPrice.toFixed(2))}` : 'FREE',
        totalPriceStringWithInterval: totalPrice ? `$${commaNumbers(totalPrice.toFixed(2))}/${compute.interval}` : 'FREE',
        region: thisInstance.is_local ? false : regions.find((r) => r.value === i.instance_region),
      };
    });

    return appState.update((s) => {
      s.instances = instances.sort((a, b) => (a.instance_name > b.instance_name ? 1 : -1));
    });
  }

  if (!instanceCount) {
    return appState.update((s) => {
      s.instances = [];
    });
  }

  return false;
};
