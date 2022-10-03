import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import generateInstanceProductDetails from '../../instances/generateInstanceProductDetails';
import addError from './addError';
import config from '../../../config';

export default async ({ auth, customer_id, products, regions, subscriptions, instanceCount = 0, instanceAuths }) => {
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
        const instanceProductDetails = generateInstanceProductDetails({ instance, products, regions, subscriptions });
        const instanceAuth = instanceAuths && instanceAuths[instance.compute_stack_id];
        const clusterEngine = parseFloat(instanceAuth.version) >=4 ? 'nats' : 'socketcluster';
        /* TODO: Move the licensing, loading, etc. management here. */
        return { ...instance, version: instanceAuth.version, clusterEngine, ...instanceProductDetails };
      });

      return appState.update((s) => {
        s.instances = [...instances].sort((a, b) => (a.instance_name > b.instance_name ? 1 : -1));
      });
    }

    if (!instanceCount) {
      return appState.update((s) => {
        s.instances = [];
      });
    }

    return false;
  } catch (e) {
    console.log(e);
    return addError({
      type: 'lms data',
      status: 'error',
      url: config.lms_api_url,
      operation: 'getInstances',
      request: { customer_id },
      error: { catch: e.toString() },
      customer_id,
    });
  }
};
