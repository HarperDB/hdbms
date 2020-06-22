import queryLMS from '../queryLMS';
import appState from '../../state/appState';

export default async ({ email, pass, signal }) => {
  const response = await queryLMS({
    endpoint: 'getUser',
    method: 'POST',
    signal,
    payload: { email, password: pass },
  });

  if (response.error && ['Unauthorized', 'User does not exist'].includes(response.message)) {
    return appState.update((s) => {
      s.auth = { ...response, time: Date.now() };
    });
  }

  if (response.error) {
    return false;
  }

  if (!response.orgs) {
    response.orgs = [
      {
        customer_id: response.customer_id.toString(),
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
