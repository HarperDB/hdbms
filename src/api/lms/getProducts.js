import queryLMS from '../queryLMS';
import appState from '../../state/appState';

import buildRadioSelectProductOptions from '../../methods/products/buildRadioSelectProductOptions';
import buildRadioSelectStorageOptions from '../../methods/products/buildRadioSelectStorageOptions';
import addError from './addError';
import config from '../../config';

export default async () => {
  let response = null;

  try {
    response = await queryLMS({
      endpoint: 'getProducts',
      method: 'POST',
    });

    if (response.error) return false;

    let products = {
      cloudStorage: [],
      cloudCompute: [],
      localCompute: [],
    };

    if (Array.isArray(response)) {
      const localComputeOptions = response.find((p) => p.name === 'HarperDB Local Annual');
      const cloudComputeOptions = response.find((p) => p.name === 'HarperDB Cloud Monthly (Beta)');
      const cloudStorageOptions = response.find((p) => p.name === 'HarperDB Cloud Storage');

      const cloudStorage = cloudStorageOptions && buildRadioSelectStorageOptions(cloudStorageOptions.plans).sort((a, b) => a.value.data_volume_size - b.value.data_volume_size);
      const cloudCompute = cloudComputeOptions && buildRadioSelectProductOptions(cloudComputeOptions.plans).sort((a, b) => a.value.ram_allocation - b.value.ram_allocation);
      const localCompute = localComputeOptions && buildRadioSelectProductOptions(localComputeOptions.plans).sort((a, b) => a.value.ram_allocation - b.value.ram_allocation);

      products = {
        cloudStorage,
        cloudCompute,
        localCompute,
      };
    }

    return appState.update((s) => {
      s.products = products;
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
