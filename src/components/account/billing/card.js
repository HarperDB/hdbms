import React, { useState } from 'react';
import { useStoreState } from 'pullstate';

import appState from '../../../state/stores/appState';

import customerHasChargeableCard from '../../../util/stripe/customerHasChargeableCard';
import StaticCard from './cardStatic';
import EditCard from './cardEdit';

export default () => {
  const [editingCard, setEditingCard] = useState(false);
  const customer = useStoreState(appState, (s) => s.customer, [editingCard]);
  const customerCard = customerHasChargeableCard(customer);

  return editingCard || !customerCard ? (
    <EditCard setEditingCard={setEditingCard} customerCard={customerCard} />
  ) : (
    <StaticCard setEditingCard={setEditingCard} customerCard={customerCard} />
  );
};
