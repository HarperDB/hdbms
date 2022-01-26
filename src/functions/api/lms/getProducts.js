import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import addError from './addError';
import buildRadioSelectProductOptions from '../../products/buildRadioSelectProductOptions';
import buildRadioSelectStorageOptions from '../../products/buildRadioSelectStorageOptions';
import config from '../../../config';

export default async () => {
  try {
    const response = await queryLMS({
      endpoint: 'getProducts',
      method: 'POST',
    });

    if (response.error) return false;

    return appState.update((s) => {
      s.products = {
        cloud_storage: buildRadioSelectStorageOptions(response.find((p) => p.name === 'HarperDB Cloud Storage')?.plans.filter((p) => !p.metadata.prepaid) || []),
        cloud_compute: buildRadioSelectProductOptions(response.find((p) => p.name === 'HarperDB Cloud Monthly (Beta)')?.plans.filter((p) => !p.metadata.prepaid) || []),
        wavelength_compute: buildRadioSelectProductOptions(response.find((p) => p.name === 'HarperDB Cloud Monthly (Wavelength)')?.plans.filter((p) => !p.metadata.prepaid) || []),
        local_compute: buildRadioSelectProductOptions(response.find((p) => p.name === 'HarperDB Local Annual')?.plans.filter((p) => !p.metadata.prepaid) || []),
      };
    });
  } catch (e) {
    return addError({
      type: 'lms data',
      status: 'error',
      url: config.lms_api_url,
      operation: 'getProducts',
      error: { catch: e.toString() },
    });
  }
};
