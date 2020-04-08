import queryLMS from '../queryLMS';
import appState from '../../state/stores/appState';

export default async ({ auth, signal, customer_id }) => {
  const response = await queryLMS({
    endpoint: 'getInvoices',
    method: 'POST',
    payload: { customer_id },
    signal,
    auth,
  });

  let invoices = [];

  if (Array.isArray(response.body)) {
    invoices = response.body;
  }

  return appState.update((s) => {
    s.invoices = invoices.filter((i) => i.amount_paid);
  });
};
