import queryLMS from '../queryLMS';

export default async ({ auth }) => {
  const response = await queryLMS({
    endpoint: 'getInvoices',
    method: 'POST',
    auth,
  });

  return response.body;
};
