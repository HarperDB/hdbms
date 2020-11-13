import queryInstance from '../queryInstance';
import instanceState from '../../state/instanceState';

export default async ({ auth, url }) => {
  const result = await queryInstance({ operation: 'list_roles' }, auth, url);
  const data = Array.isArray(result) ? result : [];

  instanceState.update((s) => {
    s.roles = data.sort((a, b) => (a.role.toLowerCase() > b.role.toLowerCase() ? 1 : -1));
  });

  return data;
};
