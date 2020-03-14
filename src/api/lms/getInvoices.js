import queryLMS from '../queryLMS';
import appState from '../../state/stores/appState';

export default async ({ auth, payload: { customer_id } }) => {
  const response = await queryLMS({
    endpoint: 'getInvoices',
    method: 'POST',
    payload: { customer_id },
    auth,
  });

  let invoices = [];

  if (Array.isArray(response.body)) {
    invoices = response.body;
  }

  return appState.update((s) => { s.invoices = invoices; });
};
