import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import addError from './addError';
import config from '../../../config';

export default async ({ auth, customer_id, signal, currentAlarmsLength }) => {
  let response = null;

  try {
    response = await queryLMS({
      endpoint: 'getAlarms',
      method: 'POST',
      payload: { customer_id },
      signal,
      auth,
    });

    if (response.error && currentAlarmsLength) {
      console.log(1);
      return appState.update((s) => {
        s.alarmsError = true;
      });
    }

    if (!Array.isArray(response) || response.error) {
      console.log(2);
      return appState.update((s) => {
        s.alarms = [];
        s.alarmsError = true;
      });
    }

    console.log(3, response);
    return appState.update((s) => {
      s.alarms = response.sort((a, b) => b.date - a.date);
      s.alarmsError = false;
    });
  } catch (e) {
    return addError({
      type: 'lms data',
      status: 'error',
      url: config.lms_api_url,
      operation: 'getAlarms',
      request: { customer_id },
      error: { catch: e.toString() },
      customer_id,
    });
  }
};
