import queryLMS from '../queryLMS';
export default async ({
  email,
  loginDomain = window.location.host
}) => queryLMS({
  endpoint: 'resetPassword',
  method: 'POST',
  payload: {
    email,
    loginDomain
  }
});