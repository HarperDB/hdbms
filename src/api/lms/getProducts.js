import queryLMS from '../queryLMS';
import appState from '../../state/appState';

import buildRadioSelectProductOptions from '../../methods/products/buildRadioSelectProductOptions';
import buildRadioSelectStorageOptions from '../../methods/products/buildRadioSelectStorageOptions';
import addError from './addError';
import config from '../../config';

export default async () => {
  try {
    const response = await queryLMS({
      endpoint: 'getProducts',
      method: 'POST',
    });

    if (response.error) return false;

    return appState.update((s) => {
      s.products = {
        cloudStorage: buildRadioSelectStorageOptions(response.find((p) => p.name === 'HarperDB Cloud Storage')?.plans || []),
        cloudCompute: buildRadioSelectProductOptions(response.find((p) => p.name === 'HarperDB Cloud Monthly (Beta)')?.plans || []),
        localCompute: buildRadioSelectProductOptions(response.find((p) => p.name === 'HarperDB Local Annual')?.plans || []),
      };
    });
  } catch (e) {
    console.log('getProducts', e);
    return addError({
      type: 'lms data',
      status: 'error',
      url: config.lms_api_url,
      operation: 'getProducts',
      error: { catch: e.toString() },
    });
  }
};
