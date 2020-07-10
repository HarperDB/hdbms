import queryInstance from '../queryInstance';

export default async ({ compute_stack_id, cluster_user, port, auth, url, is_local, customer_id }) =>
  queryInstance(
    {
      operation: 'configure_cluster',
      CLUSTERING: true,
      CLUSTERING_PORT: parseInt(port, 10),
      NODE_NAME: compute_stack_id,
      CLUSTERING_USER: cluster_user,
    },
    auth,
    url,
    is_local,
    compute_stack_id,
    customer_id
  );
