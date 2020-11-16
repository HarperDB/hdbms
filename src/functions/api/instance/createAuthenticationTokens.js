import queryInstance from '../queryInstance';

export default async ({ auth, url }) =>
  queryInstance({
    operation: { operation: 'create_authentication_tokens', username: auth.user, password: auth.pass },
    auth,
    url,
  });
