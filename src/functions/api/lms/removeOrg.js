import queryLMS from '../queryLMS';
export default async ({
  auth,
  userId,
  customerId
}) => queryLMS({
  endpoint: 'removeOrg',
  method: 'POST',
  payload: {
    userId,
    customerId
  },
  auth
});