import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import generateInstanceProductDetails from '../../methods/instances/generateInstanceProductDetails';
import addError from './addError';
import config from '../../../config';

export default async ({ auth, customer_id, products, regions, instanceCount = 0 }) => {
  let response = null;

  try {
    response = await queryLMS({
      endpoint: 'getInstances',
      method: 'POST',
      payload: {
        customer_id,
        user_id: auth.user_id,
      },
      auth,
    });

    if (Array.isArray(response)) {
      const instances = response.map((instance) => {
        const thisInstance = instance;
        const instanceProductDetails = generateInstanceProductDetails({ instance, products, regions });
        /* TODO: Move the licensing, loading, etc. management here. */
        return { ...thisInstance, ...instanceProductDetails };
      });

      return appState.update((s) => {
        s.instances = instances.sort((a, b) => (a.instance_name > b.instance_name ? 1 : -1));
      });
    }

    if (!instanceCount) {
      return appState.update((s) => {
        s.instances = [];
      });
    }

    return false;
  } catch (e) {
    return addError({
      type: 'lms data',
      url: config.lms_api_url,
      operation: 'getInstances',
      request: { customer_id },
      error: { catch: e.toString(), response },
      customer_id,
    });
  }
};
