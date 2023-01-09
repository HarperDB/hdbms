import queryInstance from '../queryInstance';

export default async ({ CLUSTERING = false, CLUSTERING_PORT = 12345, CLUSTERING_USER, NODE_NAME, auth, url }) =>
  queryInstance({
    operation: {
      operation: 'configure_cluster',
      CLUSTERING,
      CLUSTERING_PORT,
      CLUSTERING_USER,
      NODE_NAME,
    },
    auth,
    url,
  });
