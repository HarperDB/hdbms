import queryInstance from '../queryInstance';
import instanceState from '../../state/stores/instanceState';

export default async ({ instanceName, username, port, auth, url }) => {
  const query = {
    operation: 'configure_cluster',
    CLUSTERING: true,
    CLUSTERING_PORT: parseInt(port, 10),
    NODE_NAME: instanceName,
    CLUSTERING_USER: username,
  };
  const result = await queryInstance(query, auth, url);

  if (result.error) return result;

  await queryInstance({ operation: 'restart', force: 'true' }, auth, url);
  return instanceState.update((s) => { s.lastUpdate = Date.now(); });
};
