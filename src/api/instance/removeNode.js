import queryInstance from '../queryInstance';
import instanceState from '../../state/stores/instanceState';

export default async ({ compute_stack_id, auth, url }) => {
  await queryInstance(
    {
      operation: 'remove_node',
      name: compute_stack_id,
    },
    auth,
    url
  );
  return instanceState.update((s) => {
    s.lastUpdate = Date.now();
  });
};
