import queryInstance from '../api/queryInstance';
import browseTableColumns from './datatable/browseTableColumns';
import clusterStatus from '../api/instance/clusterStatus';

export default async ({ compute_stack_id, instanceAuths, products, instances, licenses }) => {
  const thisInstance = instances.find((i) => i.compute_stack_id === compute_stack_id);
  const auth = instanceAuths[compute_stack_id];
  const instance = await queryInstance({ operation: 'describe_all' }, auth, thisInstance.url);
  const users = await queryInstance({ operation: 'list_users' }, auth, thisInstance.url);
  const roles = await queryInstance({ operation: 'list_roles' }, auth, thisInstance.url);
  const license = licenses.find((l) => l.compute_stack_id === compute_stack_id);
  const product = products[thisInstance.is_local ? 'localCompute' : 'cloudCompute'].find((p) => p.value === thisInstance.stripe_plan_id);
  const storage = thisInstance.is_local ? null : products.cloudStorage.find((p) => p.value === thisInstance.data_volume_size);

  if (instance.error) {
    return instance;
  }
  const structure = browseTableColumns(instance);
  const network = await clusterStatus({ auth, url: thisInstance.url, users, roles });

  return { auth, structure, network, url: thisInstance.url, users, roles, license, details: { ...license, ...product, ...storage, ...thisInstance } };
};
