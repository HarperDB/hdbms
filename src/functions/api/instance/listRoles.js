import queryInstance from '../queryInstance';
import instanceState from '../../state/instanceState';

export default async ({ auth, url }) => {
  const result = await queryInstance({ operation: 'list_roles' }, auth, url);
  const data = Array.isArray(result) ? result.sort((a, b) => (a.role.toLowerCase() > b.role.toLowerCase() ? 1 : -1)) : [];

  instanceState.update((s) => {
    s.roles = data;
  });

  return data;
};
