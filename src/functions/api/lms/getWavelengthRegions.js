import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import addError from './addError';
import config from '../../../config';
export default async () => {
  let response = null;
  try {
    response = await queryLMS({
      endpoint: 'wl/getWavelengthRegions',
      method: 'POST'
    });
    let regions = [];
    if (Array.isArray(response)) {
      regions = response.map(region => ({
        label: `${region.communicationsServiceProvider.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())} / ${region.location.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}`,
        value: region.wavelengthZoneId
      }));
    }
    return appState.update(s => {
      s.wavelengthRegions = regions;
    });
  } catch (e) {
    return addError({
      type: 'lms data',
      status: 'error',
      url: config.lmsApiUrl,
      operation: 'getWavelengthRegions',
      error: {
        catch: e.toString()
      }
    });
  }
};