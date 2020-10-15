import queryLMS from '../queryLMS';

export default async ({ auth, ...rest }) =>
  queryLMS({
    endpoint: 'addIntegrationEngagement',
    method: 'POST',
    auth,
    payload: {
      user_id: auth.user_id,
      ...rest,
    },
  });
