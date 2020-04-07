import queryInstance from '../queryInstance';
import instanceState from '../../state/stores/instanceState';

export default async ({ compute_stack_id, auth, url }) => {
  const query = {
    operation: 'configure_cluster',
    NODE_NAME: compute_stack_id,
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
