import commaNumbers from '../util/commaNumbers';

export default (size, { tiers, interval }) => {
  const pricingTier = tiers.find((p) => (p.up_to && size <= p.up_to) || !p.up_to);
  const price = size * (pricingTier.unit_amount / 100);
  return {
    price,
    priceString: price ? `$${commaNumbers(price.toFixed(2))}` : 'FREE',
    priceStringWithInterval: price ? `$${commaNumbers(price.toFixed(2))}/${interval}` : 'FREE',
    disk_space: size === 1000 ? '1TB' : `${size}GB`,
    interval,
    label: `${size === 1000 ? '1TB' : `${size}GB`} | ${price ? `$${commaNumbers(price.toFixed(2))}/${interval}` : 'FREE'}`,
    value: size,
  };
};
