import addRole from '../../api/instance/addRole';
import instanceState from '../../state/instanceState';

export default async ({ auth, url }) => {
  await addRole({
    auth,
    url,
    role: 'cluster_user',
    permission: {
      cluster_user: true,
    },
  });
  return instanceState.update((s) => {
    s.lastUpdate = Date.now();
  });
};
