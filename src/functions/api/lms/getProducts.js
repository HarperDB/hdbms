import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import addError from './addError';
import buildRadioSelectProductOptions from '../../products/buildRadioSelectProductOptions';
import buildRadioSelectStorageOptions from '../../products/buildRadioSelectStorageOptions';
import config from '../../../config';

// maps product type -> product type id (id is listed on stripe dashboard)
const PRODUCT_MAP = {
  dev: {
    cloudCompute: 'prod_Gh1XXQx6J8YaJl',
    localCompute: 'prod_GoB3yLzygPeGMu',
    wavelengthCompute: 'prod_KloxOQofDaLs7q',
    akamaiCompute: 'prod_O2DOH61yn3qP6g',
    cloudStorage: 'prod_GoUJnVwOYvTjU9'
  },
  stage: {
    cloudCompute: 'prod_Gh1XXQx6J8YaJl',
    localCompute: 'prod_GoB3yLzygPeGMu',
    wavelengthCompute: 'prod_KloxOQofDaLs7q',
    akamaiCompute: 'prod_O2DOH61yn3qP6g',
    cloudStorage: 'prod_GoUJnVwOYvTjU9'
  },
  prod: {
    cloudCompute: 'prod_GdDIHGH6lzEqgv',
    localCompute: 'prod_H0Xx9dKkQqhMx9',
    wavelengthCompute: 'prod_KlorPRd9r1RKcz',
    akamaiCompute: 'prod_O7j9wiS1g7kPZU',
    cloudStorage: 'prod_H0XnsrToBa7a7G'
  }
};
export default async () => {
  try {
    const response = await queryLMS({
      endpoint: 'getProducts',
      method: 'POST'
    });
    if (response.error) return false;
    return appState.update(s => {
      s.products = {
        cloudStorage: buildRadioSelectStorageOptions(response.find(p => p.id === PRODUCT_MAP[config.env].cloudStorage)?.plans.filter(p => !p.metadata.prepaid) || []),
        cloudCompute: buildRadioSelectProductOptions(response.find(p => p.id === PRODUCT_MAP[config.env].cloudCompute)?.plans.filter(p => !p.metadata.prepaid) || []),
        wavelengthCompute: buildRadioSelectProductOptions(response.find(p => p.id === PRODUCT_MAP[config.env].wavelengthCompute)?.plans.filter(p => !p.metadata.prepaid) || []),
        akamaiCompute: buildRadioSelectProductOptions(response.find(p => p.id === PRODUCT_MAP[config.env].akamaiCompute)?.plans.filter(p => !p.metadata.prepaid) || []),
        localCompute: buildRadioSelectProductOptions(response.find(p => p.id === PRODUCT_MAP[config.env].localCompute)?.plans.filter(p => !p.metadata.prepaid) || [])
      };
    });
  } catch (e) {
    return addError({
      type: 'lms data',
      status: 'error',
      url: config.lmsApiUrl,
      operation: 'getProducts',
      error: {
        catch: e.toString()
      }
    });
  }
};