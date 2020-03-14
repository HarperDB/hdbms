import queryInstance from '../queryInstance';
import instanceState from '../../state/stores/instanceState';

export default async ({ instance_name, cluster_user, port, auth, url }) => {
  const query = {
    operation: 'configure_cluster',
    CLUSTERING: true,
    CLUSTERING_PORT: parseInt(port, 10),
    NODE_NAME: instance_name,
    CLUSTERING_USER: cluster_user,
  };
  const result = await queryInstance(query, auth, url);

  if (result.error) return result;

  await queryInstance({ operation: 'restart', force: 'true' }, auth, url);
  return instanceState.update((s) => { s.lastUpdate = Date.now(); });
};
