import queryLMS from '../queryLMS';
import appState from '../../state/appState';

export default async ({ auth, customer_id }) => {
  const response = await queryLMS({
    endpoint: 'getCustomer',
    method: 'POST',
    payload: { customer_id },
    auth,
  });

  if (!response.error) {
    appState.update((s) => {
      s.customer = { ...response, customer_id };
      s.hasCard = response.stripe_payment_methods?.[0];
    });
  }

  return response;
};
