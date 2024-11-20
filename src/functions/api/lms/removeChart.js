import queryLMS from '../queryLMS';
export default async ({
  auth,
  customerId,
  computeStackId,
  id
}) => queryLMS({
  endpoint: 'removeChart',
  method: 'POST',
  payload: {
    userId: auth.userId,
    customerId,
    computeStackId,
    id
  },
  auth
});