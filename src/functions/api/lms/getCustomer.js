import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import addError from './addError';
import config from '../../../config';
import getPrepaidSubscriptions from './getPrepaidSubscriptions';
export default async ({
  auth,
  customerId
}) => {
  let response = null;
  try {
    response = await queryLMS({
      endpoint: 'getCustomer',
      method: 'POST',
      payload: {
        customerId
      },
      auth
    });
    getPrepaidSubscriptions({
      auth,
      customerId,
      stripeId: response?.stripeId
    });
    if (!response.error) {
      appState.update(s => {
        s.customer = {
          ...response,
          customerId
        };
        s.hasCard = response.stripePaymentMethods?.[0];
      });
    }
    return response;
  } catch (e) {
    return addError({
      type: 'lms data',
      status: 'error',
      url: config.lmsApiUrl,
      operation: 'getCustomer',
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