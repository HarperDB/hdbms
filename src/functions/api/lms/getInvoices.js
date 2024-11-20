import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import addError from './addError';
import config from '../../../config';
export default async ({
  auth,
  signal,
  customerId
}) => {
  let response = null;
  try {
    response = await queryLMS({
      endpoint: 'getInvoices',
      method: 'POST',
      payload: {
        customerId
      },
      signal,
      auth
    });
    let invoices = [];
    if (Array.isArray(response)) {
      invoices = response;
    }
    return appState.update(s => {
      s.invoices = invoices.filter(i => i.amountPaid);
    });
  } catch (e) {
    return addError({
      type: 'lms data',
      status: 'error',
      url: config.lmsApiUrl,
      operation: 'getInvoices',
      request: {
        customerId
      },
      error: {
        catch: e.toString()
      },
      customerId
    });
  }
};