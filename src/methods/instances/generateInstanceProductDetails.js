import commaNumbers from '../util/commaNumbers';

export default ({ instance, products, regions }) => {
  try {
    const compute = products[instance.is_local ? 'localCompute' : 'cloudCompute'].find((p) => p.value.stripe_plan_id === instance.stripe_plan_id);
    const storage = instance.is_local
      ? false
      : products.cloudStorage.find((p) => p.value.data_volume_size === instance.data_volume_size && p.value.stripe_storage_plan_id === instance.stripe_storage_plan_id);

    const totalPrice = parseFloat(compute?.value?.compute_price || 0) + parseFloat(storage?.value?.storage_price || 0);
    const totalPriceString = totalPrice ? `$${commaNumbers(totalPrice.toFixed(2))}` : 'FREE';
    const totalPriceStringWithInterval = totalPrice ? `$${commaNumbers(totalPrice.toFixed(2))}/${compute.value.compute_interval}` : 'FREE';
    const region = instance.is_local ? false : regions.find((r) => r.value === instance.instance_region);

    return { compute: compute?.value, storage: storage?.value, totalPrice, totalPriceString, totalPriceStringWithInterval, region };
  } catch (e) {
    // eslint-disable-next-line no-console
    return console.log(e);
  }
};
