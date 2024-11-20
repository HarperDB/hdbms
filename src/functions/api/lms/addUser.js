import queryLMS from '../queryLMS';
export default async ({
  auth,
  email,
  customerId,
  loginDomain = window.location.host
}) => queryLMS({
  endpoint: 'addUser',
  method: 'POST',
  payload: {
    email,
    customerId,
    loginDomain,
    userId: auth.userId
  },
  auth
});