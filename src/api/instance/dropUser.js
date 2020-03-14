import queryInstance from '../queryInstance';
import instanceState from '../../state/stores/instanceState';

export default async ({ auth, username, url }) => {
  await queryInstance({ operation: 'drop_user', username }, auth, url);
  return instanceState.update((s) => { s.lastUpdate = Date.now(); });
};
