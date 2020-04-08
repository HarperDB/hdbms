import isEmail from '../isEmail';
import addCustomer from '../../api/lms/addCustomer';
import checkSubdomain from '../../api/lms/checkSubdomain';

export default async ({ formData }) => {
  const { firstname, lastname, email, customer_name, subdomain, coupon_code } = formData;

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

  const subdomainResponse = await checkSubdomain({ payload: { subdomain } });

  if (subdomainResponse.result) {
    return {
      error: 'Subdomain is not available',
    };
  }

  const response = await addCustomer({
    payload: {
      firstname,
      lastname,
      email,
      customer_name,
      subdomain,
      coupon_code,
    },
  });
  if (response.result === false) {
    return {
      error: response.message.replace('Bad request: ', '').replace(/['"]+/g, ''),
    };
  }
  return { success: true };
};
