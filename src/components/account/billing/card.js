import React, { useState } from 'react';
import useAsyncEffect from 'use-async-effect';

import customerHasChargeableCard from '../../../util/stripe/customerHasChargeableCard';
import StaticCard from './cardStatic';
import EditCard from './cardEdit';
import useApp from '../../../state/stores/appData';
import defaultAppData from '../../../state/defaults/defaultAppData';
import getCustomer from '../../../api/lms/getCustomer';
import useLMS from '../../../state/stores/lmsAuth';
import defaultLMSAuth from '../../../state/defaults/defaultLMSAuth';

export default () => {
  const [lmsAuth] = useLMS(defaultLMSAuth);
  const [appData, setAppData] = useApp(defaultAppData);
  const [editingCard, setEditingCard] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(false);
  const customerCard = appData?.customer && customerHasChargeableCard(appData.customer);

  useAsyncEffect(async () => {
    if (appData.customer) {
      const newCustomer = await getCustomer({ auth: lmsAuth, payload: { customer_id: lmsAuth.customer_id } });
      setAppData({ ...appData, customer: newCustomer });
    }
  }, [lastUpdate]);

  return (!editingCard && customerCard) ? (
    <StaticCard
      setEditingCard={setEditingCard}
      setLastUpdate={setLastUpdate}
      stripeId={appData?.customer?.stripe_id}
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
      stripeId={appData?.customer?.stripe_id}
    />
  );
};
