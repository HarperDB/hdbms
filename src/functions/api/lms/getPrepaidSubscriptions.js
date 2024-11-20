import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import addError from './addError';
import buildRadioSelectProductOptions from '../../products/buildRadioSelectProductOptions';
import buildRadioSelectStorageOptions from '../../products/buildRadioSelectStorageOptions';
import config from '../../../config';
export default async ({
  auth,
  customerId,
  stripeId
}) => {
  try {
    const response = await queryLMS({
      endpoint: 'getPrepaidSubscriptions',
      method: 'POST',
      payload: {
        customerId,
        stripeId
      },
      auth
    });
    if (response.error) return false;
    return appState.update(s => {
      s.subscriptions = {
        cloudStorage: buildRadioSelectStorageOptions(response.cloudStorage || []),
        cloudCompute: buildRadioSelectProductOptions(response.cloudCompute || []),
        wavelengthCompute: buildRadioSelectProductOptions(response.wavelengthCompute || []),
        localCompute: buildRadioSelectProductOptions(response.localCompute || [])
      };
    });
  } catch (e) {
    return addError({
      type: 'lms data',
      status: 'error',
      url: config.lmsApiUrl,
      operation: 'getPrepaidSubscriptions',
      error: {
        catch: e.toString()
      }
    });
  }
};