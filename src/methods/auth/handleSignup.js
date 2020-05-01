import isEmail from '../util/isEmail';
import addCustomer from '../../api/lms/addCustomer';
import checkSubdomain from '../../api/lms/checkSubdomain';
import isAlphaNumericHyphen from '../util/isAlphaNumericHyphen';

export default async ({ formData }) => {
  const { firstname, lastname, email, customer_name, subdomain, coupon_code, htuk, pageName, pageUri } = formData;

  if (!firstname || !lastname || !email || !customer_name || !subdomain) {
    return {
      error: 'All fields must be filled out',
    };
  }
  if (!isEmail(email)) {
    return {
      error: 'Please provide a valid email',
    };
  }
  if (!isAlphaNumericHyphen(subdomain)) {
    return {
      error: 'subdomain: alphanumeric and hyphens only',
    };
  }
  if (subdomain.length > 16) {
    return {
      error: 'subdomain: max 16 characters',
    };
  }

  const subdomainResponse = await checkSubdomain({ subdomain });

  if (subdomainResponse.result) {
    return {
      error: 'Subdomain is not available',
    };
  }

  const response = await addCustomer({
    firstname,
    lastname,
    email,
    customer_name,
    subdomain,
    coupon_code,
    htuk,
    pageName,
    pageUri,
  });
  if (response.error) {
    return {
      error: response.message.replace('Bad request: ', '').replace(/['"]+/g, ''),
    };
  }
  return { success: true };
};
