import queryLMS from '../queryLMS';
export default async ({
  firstname,
  lastname,
  email,
  customerName,
  subdomain,
  couponCode,
  htuk,
  pageName,
  pageUri,
  loginDomain = window.location.host
}) => queryLMS({
  endpoint: 'addCustomer',
  method: 'POST',
  payload: {
    firstname,
    lastname,
    email,
    customerName,
    subdomain,
    couponCode,
    htuk,
    pageName,
    pageUri,
    loginDomain
  }
});