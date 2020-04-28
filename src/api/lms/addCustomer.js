import queryLMS from '../queryLMS';

export default async ({ firstname, lastname, email, customer_name, subdomain, coupon_code }) => {
  const response = await queryLMS({
    endpoint: 'addCustomer',
    method: 'POST',
    payload: {
      firstname,
      lastname,
      email,
      customer_name,
      subdomain,
      coupon_code,
    },
  });

  return response;
};
