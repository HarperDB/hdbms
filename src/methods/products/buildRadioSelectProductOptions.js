import commaNumbers from '../util/commaNumbers';

export default ({ id, amount_decimal, interval, amount, active, metadata: { ram_allocation, instance_type } }) => {
  const price = parseInt(amount_decimal, 10) / 100;
  const ramAllocation = ram_allocation ? parseInt(ram_allocation, 10) : false;
  const commaAmount = commaNumbers(amount);
  return (
    ramAllocation && {
      plan_id: id,
      active,
      price,
      priceString: amount_decimal === '0' ? 'FREE' : `${commaAmount}`,
      priceStringWithInterval: amount_decimal === '0' ? 'FREE' : `${commaAmount}/${interval}`,
      ram: `${ramAllocation / 1024}GB`,
      ram_allocation: ramAllocation,
      instance_type,
      interval,
      label: `${ramAllocation / 1024}GB RAM | ${amount_decimal !== '0' ? `${commaAmount}/${interval}` : 'FREE'} ${!active ? '(legacy)' : ''}`,
      value: id,
    }
  );
};
