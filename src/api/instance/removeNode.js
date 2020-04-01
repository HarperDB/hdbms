import queryInstance from '../queryInstance';
import instanceState from '../../state/stores/instanceState';

export default async ({ instance_name, auth, url }) => {
  await queryInstance(
    {
      operation: 'remove_node',
      name: instance_name,
    },
    auth,
    url
  );
  return instanceState.update((s) => {
    s.lastUpdate = Date.now();
  });
};
