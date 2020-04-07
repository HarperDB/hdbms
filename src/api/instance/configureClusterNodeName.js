import queryInstance from '../queryInstance';

export default async ({ compute_stack_id, auth, url }) =>
  queryInstance(
    {
      operation: 'configure_cluster',
      NODE_NAME: compute_stack_id,
    },
    auth,
    url
  );
