import queryLMS from '../queryLMS';

export default async ({ auth, payload: { compute_stack_id, customer_id, record_id } }) => {
  const response = await queryLMS({
    endpoint: 'removeLicense',
    method: 'POST',
    payload: { compute_stack_id, customer_id, record_id },
    auth,
  });
  return response.body;
};
