import queryInstance from '../queryInstance';

export default async ({ compute_stack_id, auth, url }) =>
  queryInstance(
    {
      operation: 'remove_node',
      name: compute_stack_id,
    },
    auth,
    url
  );
