import addOrg from '../../api/lms/addOrg';
import checkSubdomain from '../../api/lms/checkSubdomain';
import isAlphaNumericHyphen from '../util/isAlphaNumericHyphen';

export default async ({ formData, auth }) => {
  const { org, subdomain } = formData;

  if (!org || !subdomain) {
    return {
      error: 'All fields must be filled out',
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

  const response = await addOrg({
    auth,
    org,
    subdomain,
  });
  if (response.error) {
    return {
      error: response.message.replace('Bad request: ', '').replace(/['"]+/g, ''),
    };
  }
  return { success: true };
};
