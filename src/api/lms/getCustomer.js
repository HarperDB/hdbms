import queryLMS from '../queryLMS';

export default async ({ auth }) => {
  const response = await queryLMS({
    endpoint: 'getCustomer',
    method: 'POST',
    auth,
  });

  return response.body;
};
