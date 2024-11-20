import queryLMS from '../queryLMS';
export default async ({
  auth,
  customerId,
  userId,
  status
}) => queryLMS({
  endpoint: 'updateUserOrgs',
  method: 'POST',
  payload: {
    customerId,
    userId,
    status
  },
  auth
});