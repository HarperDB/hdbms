import instanceState from '../../state/instanceState';

import buildNetwork from './buildNetwork';
import describeAll from '../../api/instance/describeAll';
import listUsers from '../../api/instance/listUsers';
import listRoles from '../../api/instance/listRoles';
import clusterStatus from '../../api/instance/clusterStatus';

import browseTableColumns from '../datatable/browseTableColumns';
import buildInstanceClusterPartners from './buildInstanceClusterPartners';
import buildClusteringTable from './buildClusteringTable';
import clusterConfigColumns from '../datatable/clusterConfigColumns';

export default async ({ instances, auth, compute_stack_id }) => {
  const thisInstance = instances.find((i) => i.compute_stack_id === compute_stack_id);

  if (!thisInstance) {
    return {
      error: 'Instance does not exist',
    };
  }

  const schema = await describeAll({
    auth,
    url: thisInstance.url,
  });

  if (schema.error) {
    return {
      error: 'Could not log into instance',
    };
  }

  const { structure, defaultBrowseURL } = browseTableColumns(schema);

  if (!auth.super) {
    instanceState.update((s) => {
      Object.entries({
        ...thisInstance,
        auth,
        schema,
        structure,
        defaultBrowseURL,
        loading: false,
      }).map(([key, value]) => (s[key] = value));
    });

    return {
      error: false,
    };
  }

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

  const network = await buildNetwork({
    users,
    roles,
    cluster_status,
  });

  const clustering = buildInstanceClusterPartners({
    instances: instances.filter((i) => i.compute_stack_id !== compute_stack_id),
    network,
    instance_region: thisInstance.instance_region,
  });

  const clusterDataTable = buildClusteringTable({
    instances: clustering.connected.filter((i) => i.connection.state !== 'closed'),
    structure,
  });

  const clusterDataTableColumns = clusterConfigColumns({
    auth,
    url: thisInstance.url,
  });

  instanceState.update((s) => {
    Object.entries({
      ...thisInstance,
      auth,
      schema,
      structure,
      network,
      users,
      roles,
      defaultBrowseURL,
      clustering,
      clusterDataTable,
      clusterDataTableColumns,
      loading: false,
    }).map(([key, value]) => (s[key] = value));
  });

  return {
    error: false,
  };
};
