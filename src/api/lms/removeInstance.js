import queryLMS from '../queryLMS';

export default async ({ auth, payload: { customer_id, compute_stack_id } }) => {
  const response = await queryLMS({
    endpoint: 'removeInstance',
    method: 'POST',
    payload: { customer_id, compute_stack_id },
    auth,
  });

  return response.body;
};
