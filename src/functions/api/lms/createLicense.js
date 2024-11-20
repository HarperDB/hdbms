import queryLMS from '../queryLMS';
export default async ({
  auth,
  computeStackId,
  customerId,
  fingerprint
}) => queryLMS({
  endpoint: 'createLicense',
  method: 'POST',
  payload: {
    computeStackId,
    customerId,
    fingerprint
  },
  auth
});