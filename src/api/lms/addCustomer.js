import queryLMS from '../queryLMS';

export default async ({ payload: { firstname, lastname, email, company_name, subdomain } }) => {
  const response = await queryLMS({
    endpoint: 'addCustomer',
    method: 'POST',
    payload: { firstname, lastname, email, company_name, subdomain },
    auth: { user: 'david@harperdb.io', pass: 'harperdb' },
  });

  return response.body;
};
