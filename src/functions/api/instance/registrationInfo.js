import queryInstance from '../queryInstance';
import instanceState from '../../state/instanceState';

export default async ({ auth, url }) => {
  const result = await queryInstance({
    operation: { operation: 'registration_info' },
    auth,
    url,
  });
  const data = result.error ? {} : result;

  instanceState.update((s) => {
    s.registration = data;
  });

  return result;
};
