import queryLMS from '../queryLMS';
import appState from '../../state/appState';

export default async ({ auth, customer_id }) => {
  const response = await queryLMS({
    endpoint: 'getCustomer',
    method: 'POST',
    payload: { customer_id },
    auth,
  });

  let customer = { customer_id };

  if (!response.error) {
    customer = response;
  }

  return appState.update((s) => {
    s.customer = customer;
    s.hasCard = customer.stripe_payment_methods?.[0];
  });
};
