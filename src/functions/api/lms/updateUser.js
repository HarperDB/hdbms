import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import addError from './addError';
import config from '../../../config';
import getUser from './getUser';
export default async ({
  auth,
  firstname,
  lastname,
  customerId,
  userId,
  githubRepo,
  email
}) => {
  let response = null;
  try {
    response = await queryLMS({
      endpoint: 'updateUser',
      method: 'POST',
      payload: {
        firstname,
        lastname,
        customerId,
        userId,
        githubRepo,
        email
      },
      auth
    });
    if (response.error) {
      return appState.update(s => {
        s.auth = {
          ...auth,
          ...response,
          profileError: Date.now()
        };
      });
    }
    appState.update(s => {
      s.auth = {
        ...auth,
        profileSuccess: Date.now(),
        ...response
      };
    });
    return getUser({
      email,
      pass: auth.pass,
      loggingIn: true
    });
  } catch (e) {
    return addError({
      type: 'lms data',
      status: 'error',
      url: config.lmsApiUrl,
      operation: 'updateUser',
      request: {
        firstname,
        lastname,
        customerId,
        userId,
        githubRepo
      },
      error: {
        catch: e.toString()
      },
      customerId
    });
  }
};