import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import addError from './addError';
import config from '../../config';

export default async ({ auth, signal }) => {
  let response = null;

  try {
    response = await queryLMS({
      endpoint: 'getIntegrations',
      method: 'POST',
      payload: { user_id: auth.user_id },
      signal,
      auth,
    });

    let integrations = {
      active: [],
      review: [],
    };

    if (Array.isArray(response)) {
      integrations = {
        active: response.filter((i) => i.status === 'active'),
        review: response.filter((i) => i.status === 'review'),
      };
    }

    return appState.update((s) => {
      s.integrations = integrations;
    });
  } catch (e) {
    return addError({
      type: 'lms data',
      status: 'error',
      url: config.lms_api_url,
      operation: 'getIntegrations',
      error: { catch: e.toString() },
    });
  }
};
