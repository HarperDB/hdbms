import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import addError from './addError';
import config from '../../config';

export default async ({ auth, customer_id, stripe_id }) => {
  let response = null;

  try {
    response = await queryLMS({
      endpoint: 'getSubscriptions',
      method: 'POST',
      payload: {
        customer_id,
        stripe_id,
      },
      auth,
    });

    let subscriptions = [];

    if (Array.isArray(response)) {
      subscriptions = response; // .sort((a, b) => (a.label < b.label ? 1 : -1));
    }

    return appState.update((s) => {
      s.subscriptions = subscriptions;
    });
  } catch (e) {
    return addError({
      type: 'lms data',
      status: 'error',
      url: config.lms_api_url,
      operation: 'getSubscriptions',
      error: { catch: e.toString() },
    });
  }
};
