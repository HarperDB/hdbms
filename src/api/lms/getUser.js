import queryLMS from '../queryLMS';
import appState from '../../state/appState';

export default async ({ email, pass }) => {
  const response = await queryLMS({
    endpoint: 'getUser',
    method: 'POST',
    payload: { email, password: pass },
  });

  if (response.error) {
    return appState.update((s) => {
      s.auth = response;
    });
  }

  if (!response.orgs) {
    response.orgs = [
      {
        customer_id: response.customer_id,
        customer_name: `${response.firstname}'s Org`,
        status: 'owner',
      },
    ];
  } else if (!Array.isArray(response.orgs)) {
    response.orgs = [response.orgs];
  }

  return appState.update((s) => {
    s.auth = { email, pass, ...response };
  });
};
