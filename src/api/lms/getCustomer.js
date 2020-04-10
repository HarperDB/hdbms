import queryLMS from '../queryLMS';
import appState from '../../state/appState';

export default async ({ auth, payload: { customer_id } }) => {
  const response = await queryLMS({
    endpoint: 'getCustomer',
    method: 'POST',
    payload: { customer_id },
    auth,
  });

  let customer = { customer_id };

  if (response.body.result !== false) {
    customer = response.body;
  }

  return appState.update((s) => {
    s.customer = customer;
    s.hasCard = customer.stripe_payment_methods?.[0];
  });
};
