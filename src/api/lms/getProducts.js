import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import addError from './addError';
import buildRadioSelectProductOptions from '../../methods/products/buildRadioSelectProductOptions';
import buildRadioSelectStorageOptions from '../../methods/products/buildRadioSelectStorageOptions';
import config from '../../config';

export default async ({ auth, customer_id }) => {
  try {
    const response = await queryLMS({
      endpoint: 'getProducts',
      method: 'POST',
      payload: {
        customer_id,
      },
      auth,
    });

    if (response.error) return false;

    return appState.update((s) => {
      s.products = {
        cloud_storage: buildRadioSelectStorageOptions(response.find((p) => p.name === 'HarperDB Cloud Storage')?.plans.filter((p) => !p.metadata.prepaid) || []),
        cloud_compute: buildRadioSelectProductOptions(response.find((p) => p.name === 'HarperDB Cloud Monthly (Beta)')?.plans.filter((p) => !p.metadata.prepaid) || []),
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
