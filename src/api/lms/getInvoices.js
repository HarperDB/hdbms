import queryLMS from '../queryLMS';

export default async ({ auth, payload: { customer_id } }) => {
  const response = await queryLMS({
    endpoint: 'getInvoices',
    method: 'POST',
    payload: { customer_id },
    auth,
  });

  return response.body;
};
