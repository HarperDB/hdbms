import queryLMS from '../queryLMS';
export default async ({
  auth,
  customerId,
  userId,
  userIdOwner,
  status
}) => queryLMS({
  endpoint: 'updateOrgUser',
  method: 'POST',
  payload: {
    customerId,
    userId,
    userIdOwner,
    status
  },
  auth
});