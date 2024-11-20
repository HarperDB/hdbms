import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import addError from './addError';
import config from '../../../config';
export default async ({
  auth,
  customerId
}) => {
  let response = null;
  try {
    response = await queryLMS({
      endpoint: 'getUsers',
      method: 'POST',
      payload: {
        customerId
      },
      auth
    });
    let users = [];
    if (Array.isArray(response)) {
      users = [...response].sort((a, b) => a.email > b.email ? 1 : -1);
    }
    return appState.update(s => {
      s.users = users;
    });
  } catch (e) {
    return addError({
      type: 'lms data',
      status: 'error',
      url: config.lmsApiUrl,
      operation: 'getUsers',
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