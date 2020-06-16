import commaNumbers from '../util/commaNumbers';

export default ({ instance, products, regions }) => {
  const computeProducts = products[instance.is_local ? 'localCompute' : 'cloudCompute'];
  const compute = computeProducts && computeProducts.find((p) => p.value === instance.stripe_plan_id);
  const storageProducts = instance.is_local ? false : products.cloudStorage;
  const storage = storageProducts && storageProducts.find((p) => p.value === instance.data_volume_size);
  const totalPrice = parseFloat(compute?.price || 0) + parseFloat(storage?.price || 0);
  const totalPriceString = totalPrice ? `$${commaNumbers(totalPrice.toFixed(2))}` : 'FREE';
  const totalPriceStringWithInterval = totalPrice ? `$${commaNumbers(totalPrice.toFixed(2))}/${compute.interval}` : 'FREE';
  const region = instance.is_local ? false : regions.find((r) => r.value === instance.instance_region);

  return { compute, computeProducts, storage, storageProducts, totalPrice, totalPriceString, totalPriceStringWithInterval, region };
};
