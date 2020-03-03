import queryInstance from '../api/queryInstance';
import browseTableColumns from './datatable/browseTableColumns';
import clusterStatus from '../api/instance/clusterStatus';

export default async ({ instance_id, instanceAuths, appData: { products, instances, licenses } }) => {
  const thisInstance = instances.find((i) => i.id === instance_id);
  const auth = { ...instanceAuths[instance_id], host: thisInstance.host, port: thisInstance.port, is_ssl: thisInstance.is_ssl };
  const instance = await queryInstance({ operation: 'describe_all' }, auth);
  const users = await queryInstance({ operation: 'list_users' }, auth);
  const roles = await queryInstance({ operation: 'list_roles' }, auth);
  const license = licenses.find((l) => l.instance_id === instance_id);
  const product = products[thisInstance.is_local ? 'localCompute' : 'cloudCompute'].find((p) => p.value === thisInstance.stripe_plan_id);
  const storage = thisInstance.is_local ? null : products.cloudStorage.find((p) => p.value === thisInstance.storage_qty_gb);

  if (instance.error) {
    return instance;
  }
  const structure = browseTableColumns(instance);
  const network = await clusterStatus(auth);

  return { auth, structure, network, users, roles, details: { ...license, ...product, ...storage, ...thisInstance } };
};
