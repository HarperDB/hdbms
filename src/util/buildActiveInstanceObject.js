import queryInstance from '../api/queryInstance';
import browseTableColumns from './datatable/browseTableColumns';
import clusterStatus from '../api/instance/clusterStatus';
import instanceState from '../state/stores/instanceState';

export default async ({ thisInstance, auth, license, compute, storage, computeProducts, storageProducts }) => {
  const schema = await queryInstance({ operation: 'describe_all' }, auth, thisInstance.url);
  const users = await queryInstance({ operation: 'list_users' }, auth, thisInstance.url);
  const roles = await queryInstance({ operation: 'list_roles' }, auth, thisInstance.url);

  if (schema.error) {
    return thisInstance;
  }

  const structure = browseTableColumns(schema);
  const network = await clusterStatus({ auth, url: thisInstance.url, users, roles });

  const newInstanceState = { ...thisInstance, auth, users, roles, structure, network, license, compute, storage, computeProducts, storageProducts };

  instanceState.update((s) => { Object.entries(newInstanceState).map(([key, value]) => (value ? s[key] = value : null)); });

  return newInstanceState;
};
