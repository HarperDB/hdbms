import queryLMS from '../queryLMS';

export default async ({ auth }) => queryLMS({
  endpoint: 'getRegions',
  method: 'POST',
  auth,
});
