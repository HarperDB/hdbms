import commaNumbers from '../util/commaNumbers';
const buildRadioSelectStorageOptions = plans => {
  const storageOptionsArray = [];
  plans.map(({
    tiers,
    interval,
    active,
    id,
    subscriptionId = undefined,
    name = undefined,
    available = undefined
  }) => {
    const freeTier = tiers.find(t => !!t.upTo).upTo;
    const dataVolumeSizes = [freeTier, 10, 100, 250, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000];
    const sizes = [...new Set(dataVolumeSizes)].filter(s => !subscriptionId || s !== freeTier);
    return sizes.map(dataVolumeSize => {
      const iops = 3000;
      const pricingTier = tiers.find(p => p.upTo && dataVolumeSize <= p.upTo || !p.upTo);
      const storagePrice = subscriptionId ? 0 : dataVolumeSize * (pricingTier.unitAmount / 100);
      const storagePriceString = subscriptionId ? name : storagePrice ? `$${commaNumbers(storagePrice.toFixed(2))}` : 'FREE';
      const storagePriceStringWithInterval = subscriptionId ? name : storagePrice ? `$${commaNumbers(storagePrice.toFixed(2))}/${interval}` : 'FREE';
      const dataVolumeSizeString = dataVolumeSize >= 1000 ? `${dataVolumeSize / 1000}TB` : `${dataVolumeSize}GB`;
      const prepaidDiskSpaceAvailable = !available ? 0 : available > 1000 ? `${(available / 1024).toFixed(2)}TB` : `${available}GB`;
      const label = `${dataVolumeSizeString}  •  ${subscriptionId ? `${name}  •  ${prepaidDiskSpaceAvailable} remaining` : storagePrice ? `$${commaNumbers(storagePrice.toFixed(2))}/${interval}` : 'FREE'} ${!active ? '(legacy)' : ''}`;
      return storageOptionsArray.push({
        label,
        value: {
          active,
          dataVolumeSize,
          iops,
          storageInterval: interval,
          stripeStoragePlanId: id,
          storageSubscriptionId: subscriptionId,
          storageSubscriptionName: name,
          storageQuantityAvailable: available,
          storagePrice,
          storagePriceString,
          storagePriceStringWithInterval,
          dataVolumeSizeString
        }
      });
    });
  });
  return storageOptionsArray.sort((a, b) => {
    if (a.value.dataVolumeSize === b.value.dataVolumeSize) {
      return a.value.storageSubscriptionName > b.value.storageSubscriptionName ? 1 : -1;
    }
    return a.value.dataVolumeSize - b.value.dataVolumeSize;
  });
};
export default buildRadioSelectStorageOptions;