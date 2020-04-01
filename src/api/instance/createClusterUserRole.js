import queryInstance from '../queryInstance';
import instanceState from '../../state/stores/instanceState';

export default async ({ auth, url }) => {
  const query = {
    operation: 'add_role',
    role: 'cluster_user',
    permission: {
      cluster_user: true,
    },
  };
  await queryInstance(query, auth, url);
  return instanceState.update((s) => {
    s.lastUpdate = Date.now();
  });
};
