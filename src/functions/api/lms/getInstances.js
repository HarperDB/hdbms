import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import generateInstanceProductDetails from '../../instances/generateInstanceProductDetails';
import addError from './addError';
import config from '../../../config';
import clusterStatus from '../instance/clusterStatus';
import registrationInfo from '../instance/registrationInfo';
import userInfo from '../instance/userInfo';
import getConfiguration from '../instance/getConfiguration';
import describeAll from '../instance/describeAll';
import buildInstanceDataStructure from '../../instance/buildInstanceDataStructure';

const processInstance = async ({ instance, auth, products, regions, subscriptions }) => {
  const instanceProductDetails = generateInstanceProductDetails({ instance, products, regions, subscriptions });
  const clustering = auth && (await clusterStatus({ auth, url: instance.url }));
  const registration = auth && (await registrationInfo({ auth, url: instance.url }));
  const user_info = auth && (await userInfo({ auth, url: instance.url }));
  const config_info = auth && (await getConfiguration({ auth, url: instance.url }));
  const schema = auth && (await describeAll({ auth, url: instance.url }));
  const { structure } = schema ? buildInstanceDataStructure(schema) : { structure: {} };
  const cluster_engine = parseFloat(registration?.version) >= 4 ? 'nats' : 'socketcluster';

  const instanceObject = {
    ...instance,
    auth,
    registration,
    user_info,
    structure,
    clustering: {
      engine: cluster_engine,
      enabled: clustering?.is_enabled,
      node_name_set: clustering?.node_name === instance.compute_stack_id,
      port: cluster_engine === 'socketcluster' ? config_info?.CLUSTERING_PORT : config_info?.clustering?.hubServer?.cluster?.network?.port,
    },
    ...instanceProductDetails,
  };

  return Object.entries(instanceObject).reduce((a, [k, v]) => (v == null ? a : ((a[k] = v), a)), {});
};

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
      const instances = await Promise.all(
        response.map((instance) => processInstance({ instance, auth: instanceAuths && instanceAuths[instance.compute_stack_id], products, regions, subscriptions }))
      );

      const sortedInstances = instances.sort((a, b) => (a.instance_name > b.instance_name ? 1 : -1));

      appState.update((s) => {
        s.instances = sortedInstances;
      });

      return sortedInstances;
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
