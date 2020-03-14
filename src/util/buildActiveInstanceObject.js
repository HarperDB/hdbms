import queryInstance from '../api/queryInstance';
import browseTableColumns from './datatable/browseTableColumns';
import clusterStatus from '../api/instance/clusterStatus';
import instanceState from '../state/stores/instanceState';

export default async ({ instanceAuths, compute_stack_id, instances, licenses, products }) => {
  const auth = instanceAuths[compute_stack_id];
  const instance = instances.find((i) => i.compute_stack_id === compute_stack_id);
  const license = licenses.find((l) => l.compute_stack_id === compute_stack_id);
  const compute = products[instance.is_local ? 'localCompute' : 'cloudCompute'].find((p) => p.value === instance.stripe_plan_id);
  const storage = instance.is_local ? null : products.cloudStorage.find((p) => p.value === instance.data_volume_size);
  const computeProducts = instance.is_local ? products.localCompute : products.cloudCompute;
  const storageProducts = instance.is_local ? false : products.cloudStorage;

  const schema = await queryInstance({ operation: 'describe_all' }, auth, instance.url);
  const users = await queryInstance({ operation: 'list_users' }, auth, instance.url);
  const roles = await queryInstance({ operation: 'list_roles' }, auth, instance.url);

  if (schema.error) {
    instanceState.update((s) => { s.error = schema.error; });
    return schema;
  }

  const structure = browseTableColumns(schema);
  const network = await clusterStatus({ auth, url: instance.url, users, roles });

  const newInstanceState = { ...instance, auth, users, roles, structure, network, license, compute, storage, computeProducts, storageProducts };

  instanceState.update((s) => { Object.entries(newInstanceState).map(([key, value]) => (value ? s[key] = value : null)); });

  return newInstanceState;
};
