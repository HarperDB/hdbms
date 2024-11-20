import queryLMS from '../queryLMS';
export default async ({
  auth,
  userId,
  tcVersion,
  customerId
}) => queryLMS({
  endpoint: 'addTCAcceptance',
  method: 'POST',
  payload: {
    userId,
    tcVersion,
    customerId
  },
  auth
});