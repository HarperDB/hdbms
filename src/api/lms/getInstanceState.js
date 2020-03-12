import queryLMS from '../queryLMS';

export default async ({ auth, payload: { compute_stack_id } }) => {
  const response = await queryLMS({
    endpoint: 'getInstanceState',
    method: 'POST',
    payload: { compute_stack_id },
    auth,
  });

  return response.body;
};
