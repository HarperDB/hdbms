import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import config from '../../../config';
import addError from './addError';
export default async () => {
  let response = null;
  try {
    response = await queryLMS({
      endpoint: 'getCurrentVersion',
      method: 'POST'
    });
    if (!response.number) {
      return false;
    }
    if (!response.studio) {
      response.studio = config.studioVersion;
    }
    return appState.update(s => {
      s.version = response;
    });
  } catch (e) {
    return addError({
      type: 'lms data',
      status: 'error',
      url: config.lmsApiUrl,
      operation: 'getCurrentVersion',
      error: {
        catch: e.toString()
      }
    });
  }
};