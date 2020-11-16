import queryInstance from '../queryInstance';

export default async ({ compute_stack_id, cluster_user, port, auth, url }) =>
  queryInstance({
    operation: {
      operation: 'configure_cluster',
      CLUSTERING: true,
      CLUSTERING_PORT: parseInt(port, 10),
      NODE_NAME: compute_stack_id,
      CLUSTERING_USER: cluster_user,
    },
    auth,
    url,
  });
