import React, { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';

import appState from '../../../state/stores/appState';

import customerHasChargeableCard from '../../../util/stripe/customerHasChargeableCard';
import StaticCard from './cardStatic';
import EditCard from './cardEdit';
import getCustomer from '../../../api/lms/getCustomer';

export default () => {
  const { auth, customer } = useStoreState(appState, (s) => ({
    auth: s.auth,
    customer: s.customer,
  }));

  const [editingCard, setEditingCard] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(false);
  const customerCard = customer && customerHasChargeableCard(customer);

  useAsyncEffect(() => getCustomer({ auth, payload: { customer_id: auth.customer_id } }), [lastUpdate]);

  return (!editingCard && customerCard) ? (
    <StaticCard
      setEditingCard={setEditingCard}
      setLastUpdate={setLastUpdate}
      stripeId={customer?.stripe_id}
      cardId={customerCard?.id}
      cardPostalCode={customerCard?.billing_details?.address?.postal_code}
      cardLast4={customerCard?.card?.last4}
      cardExp={customerCard ? `${customerCard.card.exp_month} / ${customerCard.card.exp_year}` : false}
    />
  ) : (
    <EditCard
      setEditingCard={setEditingCard}
      setLastUpdate={setLastUpdate}
      cardId={customerCard?.id}
      stripeId={customer?.stripe_id}
    />
  );
};
