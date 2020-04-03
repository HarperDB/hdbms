import queryInstance from '../queryInstance';
import instanceState from '../../state/stores/instanceState';

export default async ({ compute_stack_id, cluster_user, port, auth, url }) => {
  const query = {
    operation: 'configure_cluster',
    CLUSTERING: true,
    CLUSTERING_PORT: parseInt(port, 10),
    NODE_NAME: compute_stack_id,
    CLUSTERING_USER: cluster_user,
  };
  const result = await queryInstance(query, auth, url);

  if (result.error) return result;

  await queryInstance(
    {
      operation: 'restart',
      force: 'true',
    },
    auth,
    url
  );
  return instanceState.update((s) => {
    s.lastUpdate = Date.now();
  });
};
