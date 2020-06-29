import addUser from '../../api/instance/addUser';
import instanceState from '../../state/instanceState';

export default async ({ username, password, role, auth, url, is_local, compute_stack_id, customer_id }) => {
  const result = await addUser({ username, password, role, auth, url, is_local, compute_stack_id, customer_id });

  if (result.message.indexOf('already exists') !== -1) {
    return {
      result: false,
      message: result.message,
    };
  }
  return instanceState.update((s) => {
    s.lastUpdate = Date.now();
  });
};
