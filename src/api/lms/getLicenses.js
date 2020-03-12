import queryLMS from '../queryLMS';
import appState from '../../state/stores/appState';

export default async ({ auth, payload: { customer_id } }) => {
  const response = await queryLMS({
    endpoint: 'getLicenses',
    method: 'POST',
    payload: { customer_id },
    auth,
  });

  let licenses = [];

  if (Array.isArray(response.body)) {
    licenses = response.body;
  }

  appState.update((s) => { s.licenses = licenses; });
  return licenses;
};
