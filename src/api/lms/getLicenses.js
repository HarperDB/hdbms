import queryLMS from '../queryLMS';

export default async ({ auth }) => queryLMS({
  endpoint: 'getLicenses',
  method: 'POST',
  auth,
});
