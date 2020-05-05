import queryLMS from '../queryLMS';

export default async ({ auth, ...rest }) =>
  queryLMS({
    endpoint: 'addInstance',
    method: 'POST',
    payload: { ...rest },
    auth,
  });
