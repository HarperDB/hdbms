import queryLMS from '../queryLMS';
import appState from '../../state/appState';

export default async ({ auth, customer_id }) => {
  const response = await queryLMS({
    endpoint: 'getUsers',
    method: 'POST',
    payload: { customer_id },
    auth,
  });

  let users = [];

  if (Array.isArray(response)) {
    users = response.sort((a, b) => (a.email > b.email ? 1 : -1));
  }

  return appState.update((s) => {
    s.users = users;
  });
};
