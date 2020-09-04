import isEmail from '../util/isEmail';
import addCustomer from '../../api/lms/addCustomer';
import checkSubdomain from '../../api/lms/checkSubdomain';
import isAlphaNumeric from '../util/isAlphaNumeric';

export default async ({ formData }) => {
  const { firstname, lastname, email, subdomain, coupon_code, htuk, pageName, pageUri } = formData;

  if (!firstname || !lastname || !email || !subdomain) {
    return {
      error: 'All fields must be filled out',
    };
  }
  if (!isEmail(email)) {
    return {
      error: 'Please provide a valid email',
    };
  }

  if (!isAlphaNumeric(subdomain)) {
    return {
      error: 'subdomain: alphanumeric characters only',
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
    customer_name: `${firstname}'s Org`,
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
  if (window.ORIBI) {
    window.ORIBI.api('setUserEmail', email);
    window.ORIBI.api('track', 'successful_signup');
  }
  return { success: true };
};
