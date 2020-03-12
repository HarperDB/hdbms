import queryLMS from '../queryLMS';
import appState from '../../state/stores/appState';

const buildRadioSelectProductOptions = ({ id, amount_decimal, interval, amount, metadata: { instance_ram, instance_type } }) => ({
  price: amount_decimal !== '0' ? (amount_decimal / 100).toFixed(2) : 'FREE',
  ram: instance_ram,
  instance_type,
  interval,
  label: `${instance_ram} RAM | ${amount_decimal !== '0' ? `${amount}/${interval}` : 'FREE'}`,
  value: id,
});

const buildRadioSelectStorageOptions = (size, { tiers, interval }) => {
  const pricingTier = tiers.find((p) => (p.up_to && size <= p.up_to) || !p.up_to);
  const price = (size * (pricingTier.unit_amount / 100)).toFixed(2);
  return {
    price: pricingTier.unit_amount ? (size * (pricingTier.unit_amount / 100)).toFixed(2) : 'FREE',
    disk_space: size === 1000 ? '1TB' : `${size}GB`,
    interval,
    label: `${size === 1000 ? '1TB' : `${size}GB`} Disk Space | ${pricingTier.unit_amount ? `$${price}/${interval}` : 'FREE'}`,
    value: size,
  };
};

export default async () => {
  const response = await queryLMS({
    endpoint: 'getProducts',
    method: 'POST',
  });

  let products = {
    cloudStorage: [],
    cloudCompute: [],
    localCompute: [],
  };

  if (Array.isArray(response.body)) {
    const localComputeOptions = response.body.find((p) => p.name === 'HarperDB Local Annual');
    const cloudComputeOptions = response.body.find((p) => p.name === 'HarperDB Cloud Beta');
    const cloudStoragePlans = response.body.find((p) => p.name === 'HarperDB Cloud Storage');
    const cloudStorageOptions = [10, 100, 250, 500, 1000];

    const cloudStorage = cloudStorageOptions.map((size) => buildRadioSelectStorageOptions(size, cloudStoragePlans.plans[0]));
    const cloudCompute = cloudComputeOptions.plans.map((p) => buildRadioSelectProductOptions(p));
    const localCompute = localComputeOptions.plans.map((p) => buildRadioSelectProductOptions(p));

    products = {
      cloudStorage,
      cloudCompute,
      localCompute,
    };
  }

  appState.update((s) => { s.products = products; });
  return products;
};
