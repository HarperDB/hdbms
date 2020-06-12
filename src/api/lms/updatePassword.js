import queryLMS from '../queryLMS';
import appState from '../../state/appState';

export default async ({ auth, user_id, password }) => {
  const response = await queryLMS({
    endpoint: 'updatePassword',
    method: 'POST',
    payload: { user_id, password },
    auth,
  });

  if (response.error) {
    return appState.update((s) => {
      s.auth = { ...auth, ...response, passwordError: Date.now() };
    });
  }

  return appState.update((s) => {
    s.auth = { ...auth, passwordSuccess: Date.now(), update_password: false, ...response, pass: password };
  });
};
