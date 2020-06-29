import addRole from '../../api/instance/addRole';
import instanceState from '../../state/instanceState';

export default async ({ auth, url, is_local, compute_stack_id, customer_id }) => {
  await addRole({
    auth,
    url,
    role: 'cluster_user',
    permission: {
      cluster_user: true,
    },
    is_local,
    compute_stack_id,
    customer_id,
  });
  return instanceState.update((s) => {
    s.lastUpdate = Date.now();
  });
};
