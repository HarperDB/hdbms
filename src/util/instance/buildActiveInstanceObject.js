import getNetwork from '../../api/instance/getNetwork';
import describeAll from '../../api/instance/describeAll';
import listUsers from '../../api/instance/listUsers';
import listRoles from '../../api/instance/listRoles';
import clusterStatus from '../../api/instance/clusterStatus';

import instanceState from '../../state/stores/instanceState';

import browseTableColumns from '../datatable/browseTableColumns';
import buildPermissionStructure from './buildPermissionStructure';

export default async ({ thisInstance, auth, license, compute, storage, computeProducts, storageProducts }) => {
  const schema = await describeAll({
    auth,
    url: thisInstance.url,
  });
  const users = await listUsers({
    auth,
    url: thisInstance.url,
  });
  const roles = await listRoles({
    auth,
    url: thisInstance.url,
  });
  const cluster_status = await clusterStatus({
    auth,
    url: thisInstance.url,
  });

  if (schema.error) {
    return {
      ...thisInstance,
      structure: false,
    };
  }

  const structure = browseTableColumns(schema);
  const permissions = buildPermissionStructure(schema);
  const network = await getNetwork({
    auth,
    url: thisInstance.url,
    users,
    roles,
    cluster_status,
  });

  const newInstanceState = {
    ...thisInstance,
    auth,
    users,
    roles,
    permissions,
    structure,
    network,
    license,
    compute,
    storage,
    computeProducts,
    storageProducts,
  };

  await instanceState.update((s) => {
    Object.entries(newInstanceState).map(([key, value]) => (s[key] = value));
  });

  return {
    message: `created instance object for ${thisInstance.compute_stack_id}`,
  };
};
