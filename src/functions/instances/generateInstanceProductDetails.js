import commaNumbers from '../util/commaNumbers';
import chooseCompute from './chooseCompute';
export default ({
  instance,
  products,
  regions,
  subscriptions
}) => {
  try {
    const computeProducts = instance.computeSubscriptionId ? subscriptions[chooseCompute(instance)] : products[chooseCompute(instance)];
    const compute = computeProducts?.find(p => p.value.stripePlanId === instance.stripePlanId && (!instance.computeSubscriptionId || p.value.computeSubscriptionId === instance.computeSubscriptionId));
    const storageProducts = instance.storageSubscriptionId ? subscriptions.cloudStorage : products.cloudStorage;
    const storage = instance.isLocal ? false : storageProducts?.find(p => p.value.dataVolumeSize === instance.dataVolumeSize && p.value.stripeStoragePlanId === instance.stripeStoragePlanId && (!instance.storageSubscriptionId || p.value.storageSubscriptionId === instance.storageSubscriptionId));
    const totalPrice = parseFloat(compute?.value?.computePrice || 0) + parseFloat(storage?.value?.storagePrice || 0);
    const totalPriceString = totalPrice ? `$${commaNumbers(totalPrice.toFixed(2))}` : 'FREE';
    const totalPriceStringWithInterval = instance.computeSubscriptionId && instance.storageSubscriptionId ? 'PREPAID' : totalPrice ? `${totalPriceString}/${compute.value.computeInterval}` : 'FREE';
    const region = instance.isLocal ? false : regions.find(r => r.value === instance.instanceRegion);
    return {
      compute: compute?.value,
      storage: storage?.value,
      totalPrice,
      totalPriceString,
      totalPriceStringWithInterval,
      region
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    return console.log(e);
  }
};