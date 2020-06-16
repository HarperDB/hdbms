import queryLMS from '../queryLMS';
import appState from '../../state/appState';

export default async ({ auth, firstname, lastname, customer_id, user_id }) => {
  const response = await queryLMS({
    endpoint: 'updateUser',
    method: 'POST',
    payload: { firstname, lastname, customer_id, user_id },
    auth,
  });

  if (response.error) {
    return appState.update((s) => {
      s.auth = { ...auth, ...response, profileError: Date.now() };
    });
  }

  return appState.update((s) => {
    s.auth = { ...auth, profileSuccess: Date.now(), ...response };
  });
};
