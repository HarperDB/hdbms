import queryInstance from '../queryInstance';
import instanceState from '../../state/stores/instanceState';

export default async ({ username, password, role, auth, url }) => {
  const query = {
    operation: 'add_user',
    role,
    username,
    password,
    active: true,
  };
  await queryInstance(query, auth, url);
  return instanceState.update((s) => { s.lastUpdate = Date.now(); });
};
