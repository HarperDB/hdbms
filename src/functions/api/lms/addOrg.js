import queryLMS from '../queryLMS';
export default async ({
  auth,
  org,
  subdomain
}) => queryLMS({
  endpoint: 'addOrg',
  method: 'POST',
  auth,
  payload: {
    org,
    subdomain,
    userId: auth.userId
  }
});