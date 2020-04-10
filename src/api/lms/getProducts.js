import queryLMS from '../queryLMS';
import appState from '../../state/appState';

import commaNumbers from '../../methods/util/commaNumbers';

const buildRadioSelectProductOptions = ({ id, amount_decimal, interval, amount, metadata: { ram_allocation, instance_type } }) => {
  const price = parseInt(amount_decimal, 10) / 100;
  return {
    price,
    priceString: amount_decimal === '0' ? 'FREE' : `${commaNumbers(amount)}`,
    priceStringWithInterval: amount_decimal === '0' ? 'FREE' : `${commaNumbers(amount)}/${interval}`,
    ram: `${parseInt(ram_allocation, 10) / 1024}GB`,
    ram_allocation: parseInt(ram_allocation, 10),
    instance_type,
    interval,
    label: `${parseInt(ram_allocation, 10) / 1024}GB RAM | ${amount_decimal !== '0' ? `${commaNumbers(amount)}/${interval}` : 'FREE'}`,
    value: id,
  };
};

const buildRadioSelectStorageOptions = (size, { tiers, interval }) => {
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

export default async () => {
  const response = await queryLMS({
    endpoint: 'getProducts',
    method: 'POST',
  });

  if (response.errorMessage) return false;

  let products = {
    cloudStorage: [],
    cloudCompute: [],
    localCompute: [],
  };

  if (Array.isArray(response.body)) {
    const localComputeOptions = response.body.find((p) => p.name === 'HarperDB Local Annual');
    const cloudComputeOptions = response.body.find((p) => p.name === 'HarperDB Cloud Monthly (Beta)');
    const cloudStoragePlans = response.body.find((p) => p.name === 'HarperDB Cloud Storage');
    const cloudStorageOptions = [10, 100, 250, 500, 1000];

    const cloudStorage = cloudStorageOptions.map((size) => buildRadioSelectStorageOptions(size, cloudStoragePlans.plans[0]));
    const cloudCompute = cloudComputeOptions.plans.map((p) => buildRadioSelectProductOptions(p)).sort((a, b) => a.ram - b.ram);
    const localCompute = localComputeOptions.plans.map((p) => buildRadioSelectProductOptions(p)).sort((a, b) => a.ram - b.ram);

    products = {
      cloudStorage,
      cloudCompute,
      localCompute,
    };
  }

  return appState.update((s) => {
    s.products = products;
  });
};
