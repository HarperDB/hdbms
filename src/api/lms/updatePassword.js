import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import addError from './addError';
import config from '../../config';

export default async ({ auth, user_id, password }) => {
  let response = null;

  try {
    response = await queryLMS({
      endpoint: 'updatePassword',
      method: 'POST',
      payload: { user_id, password },
      auth,
    });

    if (response.error) {
      return appState.update((s) => {
        s.auth = { ...auth, ...response, passwordError: Date.now() };
      });
    }

    return appState.update((s) => {
      s.auth = { ...auth, passwordSuccess: Date.now(), update_password: false, ...response, pass: password };
    });
  } catch (e) {
    return addError({
      type: 'lms data',
      url: config.lms_api_url,
      operation: 'updatePassword',
      request: { user_id },
      error: { catch: e.toString(), response },
    });
  }
};
