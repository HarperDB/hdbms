import queryInstance from './_queryInstance';

export default async ({ instanceId, username, port, auth, refreshInstance }) => {
  const query = {
    operation: 'configure_cluster',
    CLUSTERING: true,
    CLUSTERING_PORT: parseInt(port, 10),
    NODE_NAME: instanceId.replace(/[\W_]+/g, ''),
    CLUSTERING_USER: username,
  };
  const result = await queryInstance(query, auth);
  // const restart = await queryInstance({ operation: 'restart' }, auth);
  refreshInstance(Date.now());
  return result;
};
