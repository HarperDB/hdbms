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
      const cloudStoragePlans = response.find((p) => p.name === 'HarperDB Cloud Storage');
      const cloudStorageOptions = [10, 100, 250, 500, 1000];

      const cloudStorage = cloudStoragePlans && cloudStorageOptions.map((size) => buildRadioSelectStorageOptions(size, cloudStoragePlans.plans[0]));
      const cloudCompute = cloudComputeOptions && cloudComputeOptions.plans.map((p) => buildRadioSelectProductOptions(p)).sort((a, b) => a.ram - b.ram);
      const localCompute = localComputeOptions && localComputeOptions.plans.map((p) => buildRadioSelectProductOptions(p)).sort((a, b) => a.ram - b.ram);

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
    return addError({
      type: 'lms data',
      url: config.lms_api_url,
      operation: 'getProducts',
      error: { catch: e.toString(), response },
    });
  }
};
