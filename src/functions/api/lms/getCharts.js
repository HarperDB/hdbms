import queryLMS from '../queryLMS';
import instanceState from '../../state/instanceState';
import addError from './addError';
import config from '../../../config';
export default async ({
  auth,
  customerId,
  computeStackId,
  signal
}) => {
  let response = null;
  try {
    response = await queryLMS({
      endpoint: 'getCharts',
      method: 'POST',
      payload: {
        customerId,
        computeStackId,
        userId: auth.userId
      },
      auth,
      signal
    });
    if (!response.error) {
      instanceState.update(s => {
        s.charts = response;
      });
    }
    return response;
  } catch (e) {
    return addError({
      type: 'lms data',
      status: 'error',
      url: config.lmsApiUrl,
      operation: 'getCharts',
      request: {
        customerId,
        computeStackId,
        userId: auth.userId
      },
      error: {
        catch: e.toString()
      },
      customerId
    });
  }
};