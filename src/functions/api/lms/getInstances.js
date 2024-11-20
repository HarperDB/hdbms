import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import generateInstanceProductDetails from '../../instances/generateInstanceProductDetails';
import addError from './addError';
import config from '../../../config';
export default async ({
  auth,
  customerId,
  products,
  regions,
  subscriptions,
  instanceCount = 0
}) => {
  let response = null;
  try {
    response = await queryLMS({
      endpoint: 'getInstances',
      method: 'POST',
      payload: {
        customerId,
        userId: auth.userId
      },
      auth
    });
    if (Array.isArray(response)) {
      const instances = response.map(instance => {
        const instanceProductDetails = generateInstanceProductDetails({
          instance,
          products,
          regions,
          subscriptions
        });
        return {
          ...instance,
          ...instanceProductDetails
        };
      });
      const sortedInstances = instances.sort((a, b) => a.instanceName > b.instanceName ? 1 : -1);
      appState.update(s => {
        s.instances = sortedInstances;
      });
      return sortedInstances;
    }
    if (!instanceCount) {
      return appState.update(s => {
        s.instances = [];
      });
    }
    return false;
  } catch (e) {
    return addError({
      type: 'lms data',
      status: 'error',
      url: config.lmsApiUrl,
      operation: 'getInstances',
      request: {
        customerId
      },
      error: {
        catch: e.toString()
      },
      customerId
    });
  }
};