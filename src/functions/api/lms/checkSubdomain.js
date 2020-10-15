import queryLMS from '../queryLMS';

export default async ({ subdomain }) =>
  queryLMS({
    endpoint: 'checkSubdomain',
    method: 'POST',
    payload: { subdomain },
  });
