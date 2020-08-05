import commaNumbers from '../util/commaNumbers';

export default (plans) => {
  const storageOptionsArray = [];

  plans.map(({ tiers, interval, active, id, subscription_id = undefined, name = undefined, quantity = undefined, available = undefined, metadata: { prepaid } }) => {
    const freeTier = tiers.find((t) => !!t.up_to).up_to;
    const sizes = [...new Set([freeTier, 10, 100, 250, 500, 1000])].filter((s) => prepaid || !quantity || (s !== freeTier && s <= available));

    return sizes.map((data_volume_size) => {
      const pricing_tier = tiers.find((p) => (p.up_to && data_volume_size <= p.up_to) || !p.up_to);
      const storage_price = subscription_id ? 0 : data_volume_size * (pricing_tier.unit_amount / 100);
      const storage_price_string = subscription_id ? name : storage_price ? `$${commaNumbers(storage_price.toFixed(2))}` : 'FREE';
      const storage_price_string_with_interval = subscription_id ? name : storage_price ? `$${commaNumbers(storage_price.toFixed(2))}/${interval}` : 'FREE';
      const data_volume_size_string = data_volume_size === 1000 ? '1TB' : `${data_volume_size}GB`;
      const prepaid_disk_space_available = !available ? 0 : available > 1000 ? `${(available / 1024).toFixed(2)}` : available;
      const label = `${data_volume_size_string} | ${
        subscription_id ? `${name} (${prepaid_disk_space_available} remaining)` : storage_price ? `$${commaNumbers(storage_price.toFixed(2))}/${interval}` : 'FREE'
      } ${!active ? '(legacy)' : ''}`;

      return storageOptionsArray.push({
        label,
        value: {
          active,
          data_volume_size,
          storage_interval: interval,
          stripe_storage_plan_id: id,
          storage_subscription_id: subscription_id,
          storage_subscription_name: name,
          storage_quantity_available: available,
          storage_price,
          storage_price_string,
          storage_price_string_with_interval,
          data_volume_size_string,
        },
      });
    });
  });

  return storageOptionsArray.sort((a, b) => a.value.data_volume_size - b.value.data_volume_size);
};
