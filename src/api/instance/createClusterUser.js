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
  const result = await queryInstance(query, auth, url);

  if (result.message.indexOf('already exists') !== -1) {
    return {
      result: false,
      message: result.message,
    };
  }
  return instanceState.update((s) => { s.lastUpdate = Date.now(); });
};
