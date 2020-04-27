import commaNumbers from '../util/commaNumbers';

export default ({ id, amount_decimal, interval, amount, metadata: { ram_allocation, instance_type } }) => {
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
