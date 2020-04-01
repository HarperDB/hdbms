import queryLMS from '../queryLMS';
import appState from '../../state/stores/appState';

export default async ({ auth, payload: { customer_id } }) => {
  const response = await queryLMS({
    endpoint: 'getUsers',
    method: 'POST',
    payload: { customer_id },
    auth,
  });

  let users = [];

  if (Array.isArray(response.body)) {
    users = response.body.sort((a, b) => (a.lastname < b.lastname ? 1 : -1));
  }

  return appState.update((s) => {
    s.users = users;
  });
};
