import queryInstance from '../queryInstance';
import instanceState from '../../state/instanceState';

export default async ({ auth, url }) => {
  const result = await queryInstance({ operation: 'registration_info' }, auth, url);
  const data = result.error ? {} : result;

  return instanceState.update((s) => {
    s.registration = data;
  });
};
