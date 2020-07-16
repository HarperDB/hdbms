import commaNumbers from '../util/commaNumbers';

export default ({ instance, products, regions }) => {
  try {
    const computeProducts = products[instance.is_local ? 'localCompute' : 'cloudCompute'].filter((p) => p.active || p.value.stripe_plan_id === instance.stripe_plan_id);
    const compute = computeProducts && computeProducts.find((p) => p.value.stripe_plan_id === instance.stripe_plan_id);
    const storageProducts = instance.is_local
      ? false
      : products.cloudStorage.filter(
          (p) =>
            (p.active && (p.value.stripe_storage_plan_id !== instance.stripe_storage_plan_id ? p.value.data_volume_size !== instance.data_volume_size : true)) ||
            (p.value.stripe_storage_plan_id === instance.stripe_storage_plan_id && p.value.data_volume_size === instance.data_volume_size)
        );
    const storage =
      storageProducts && storageProducts.find((p) => p.value.data_volume_size === instance.data_volume_size && p.value.stripe_storage_plan_id === instance.stripe_storage_plan_id);

    const totalPrice = parseFloat(compute?.value?.compute_price || 0) + parseFloat(storage?.value?.storage_price || 0);
    const totalPriceString = totalPrice ? `$${commaNumbers(totalPrice.toFixed(2))}` : 'FREE';
    const totalPriceStringWithInterval = totalPrice ? `$${commaNumbers(totalPrice.toFixed(2))}/${compute.interval}` : 'FREE';
    const region = instance.is_local ? false : regions.find((r) => r.value === instance.instance_region);

    return { compute: compute.value, computeProducts, storage: storage.value, storageProducts, totalPrice, totalPriceString, totalPriceStringWithInterval, region };
  } catch (e) {
    console.log(e);
  }
};
