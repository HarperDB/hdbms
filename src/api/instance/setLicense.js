import queryInstance from '../queryInstance';
import instanceState from '../../state/stores/instanceState';

export default async ({ auth, key, company, url }) => {
  await queryInstance({ operation: 'set_license', key, company }, auth, url);
  return instanceState.update((s) => { s.lastUpdate = Date.now(); });
};
