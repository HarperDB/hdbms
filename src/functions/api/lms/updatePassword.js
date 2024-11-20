import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import addError from './addError';
import config from '../../../config';
export default async ({
  auth,
  userId,
  password
}) => {
  let response = null;
  try {
    response = await queryLMS({
      endpoint: 'updatePassword',
      method: 'POST',
      payload: {
        userId,
        password,
        loggingIn: true
      },
      auth
    });
    if (response.error) {
      return appState.update(s => {
        s.auth = {
          ...auth,
          ...response,
          passwordError: Date.now()
        };
      });
    }
    return appState.update(s => {
      s.auth = {
        ...auth,
        passwordSuccess: Date.now(),
        updatePassword: false,
        ...response,
        pass: password
      };
    });
  } catch (e) {
    return addError({
      type: 'lms data',
      status: 'error',
      url: config.lmsApiUrl,
      operation: 'updatePassword',
      request: {
        userId
      },
      error: {
        catch: e.toString()
      }
    });
  }
};