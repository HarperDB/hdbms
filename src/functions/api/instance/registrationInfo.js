import queryInstance from '../queryInstance';
import instanceState from '../../state/instanceState';

export default async ({ auth, url }) => {
  const result = await queryInstance({
    operation: { operation: 'registration_info' },
    auth,
    url,
    timeout: 5000,
  });

  instanceState.update((s) => {
    s.useRoleIdInsteadOfRoleName = result.error ? true : result?.version?.substr(0, 2) === '2.';
    s.registration = result.error ? {} : result;
  });

  return result;
};
