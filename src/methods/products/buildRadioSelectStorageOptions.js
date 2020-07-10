import commaNumbers from '../util/commaNumbers';

export default (plans) => {
  const storageOptionsArray = [];

  plans.map(({ tiers, interval, active, id }) => {
    const sizes = [...new Set([tiers.find((t) => !t.unit_amount).up_to, 10, 100, 250, 500, 1000])];
    return sizes.map((size) => {
      const pricingTier = tiers.find((p) => (p.up_to && size <= p.up_to) || !p.up_to);
      const price = size * (pricingTier.unit_amount / 100);
      return storageOptionsArray.push({
        plan_id: id,
        active,
        price,
        priceString: price ? `$${commaNumbers(price.toFixed(2))}` : 'FREE',
        priceStringWithInterval: price ? `$${commaNumbers(price.toFixed(2))}/${interval}` : 'FREE',
        disk_space: size === 1000 ? '1TB' : `${size}GB`,
        interval,
        label: `${size === 1000 ? '1TB' : `${size}GB`} | ${price ? `$${commaNumbers(price.toFixed(2))}/${interval}` : 'FREE'} ${!active ? '(legacy)' : ''}`,
        value: size,
      });
    });
  });

  return storageOptionsArray;
};
