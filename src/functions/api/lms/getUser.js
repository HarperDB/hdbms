import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import addError from './addError';
import config from '../../../config';
export default async ({
  email,
  pass,
  loggingIn = false,
  signal
}) => {
  let response = null;
  try {
    response = await queryLMS({
      endpoint: 'getUser',
      method: 'POST',
      signal,
      payload: {
        email,
        password: pass,
        loggingIn
      }
    });
    if (response.error && loggingIn) {
      return appState.update(s => {
        s.auth = {
          ...response,
          time: Date.now()
        };
      });
    }
    if (response.error) {
      return false;
    }
    if (!response.orgs) {
      response.orgs = [{
        customerId: response.customerId.toString(),
        customerName: `${response.firstname}'s Org`,
        status: 'owner'
      }];
    } else if (!Array.isArray(response.orgs)) {
      response.orgs = [response.orgs];
    }
    return appState.update(s => {
      s.auth = {
        email,
        pass,
        ...response
      };
    });
  } catch (e) {
    if (!loggingIn) {
      addError({
        type: 'lms data',
        status: 'error',
        url: config.lmsApiUrl,
        operation: 'getUser',
        error: {
          catch: e.message
        }
      });
    }
    return appState.update(s => {
      s.auth = {
        error: true,
        message: e.message,
        time: Date.now()
      };
    });
  }
};