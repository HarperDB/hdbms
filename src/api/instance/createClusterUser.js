import queryInstance from '../queryInstance';
import instanceState from '../../state/stores/instanceState';

export default async ({ username, password, role, auth, url }) => {
  const result = await queryInstance(
    {
      operation: 'add_user',
      role,
      username,
      password,
      active: true,
    },
    auth,
    url
  );

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
