import queryLMS from '../queryLMS';

export default async ({ auth, payload: { firstname, lastname, email, company, subdomain } }) => {
  const response = await queryLMS({
    endpoint: 'addCustomer',
    method: 'POST',
    payload: { firstname, lastname, email, company, subdomain },
    auth,
  });

  return response.body;
};
