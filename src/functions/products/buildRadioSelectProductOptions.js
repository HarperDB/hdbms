import commaNumbers from '../util/commaNumbers';
export default plans => {
  const computeOptionsArray = [];
  plans.map(({
    id,
    amountDecimal,
    interval,
    amount,
    active,
    subscriptionId = undefined,
    name = undefined,
    quantity = undefined,
    available = undefined,
    trialPeriodDays = null,
    metadata: {
      ramAllocation,
      instanceType,
      hasGpus
    }
  }) => {
    const computePrice = subscriptionId ? 0 : parseInt(amountDecimal, 10) / 100;
    const computeCommaAmount = commaNumbers(amount);
    const computePriceString = subscriptionId ? name : amountDecimal === '0' ? 'FREE' : `${computeCommaAmount}`;
    const computePriceStringWithInterval = subscriptionId ? name : amountDecimal === '0' ? 'FREE' : `${computeCommaAmount}/${interval}`;
    const computeRam = ramAllocation ? parseInt(ramAllocation, 10) : false;
    const computeRamString = `${computeRam / 1024}GB`;
    const label = `${computeRamString} RAM  ${hasGpus ? '+ GPU Support ' : ''}•  ${subscriptionId ? `${name}  •  ${available} remaining` : amountDecimal !== '0' ? `${computeCommaAmount}/${interval}` : 'FREE'} ${!active ? '(legacy)' : ''} ${trialPeriodDays ? `• ${trialPeriodDays} DAY FREE TRIAL` : ''}`;
    return computeRam && computeOptionsArray.push({
      label,
      value: {
        active,
        instanceType,
        trialPeriodDays,
        stripePlanId: id,
        computeInterval: interval,
        computeSubscriptionName: name,
        computeSubscriptionId: subscriptionId,
        computeQuantity: quantity,
        computeQuantityAvailable: available,
        computeRam,
        computeRamString,
        computePrice,
        computeCommaAmount,
        computePriceString,
        computePriceStringWithInterval
      }
    });
  });
  return computeOptionsArray.sort((a, b) => {
    if (a.value.computeRam === b.value.computeRam) {
      return a.value.computeSubscriptionName > b.value.computeSubscriptionName ? 1 : -1;
    }
    return a.value.computeRam - b.value.computeRam;
  });
};