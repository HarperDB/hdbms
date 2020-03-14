import queryInstance from '../queryInstance';
import instanceState from '../../state/stores/instanceState';

export default async ({ auth, role, username, password, url }) => {
  await queryInstance({ operation: 'add_user', role, username, password, active: true }, auth, url);
  return instanceState.update((s) => { s.lastUpdate = Date.now(); });
};
