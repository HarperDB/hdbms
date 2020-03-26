import queryLMS from '../queryLMS';

export default async ({ auth, payload: { compute_stack_id, customer_id, fingerprint } }) => {
  const response = await queryLMS({
    endpoint: 'createLicense',
    method: 'POST',
    payload: { compute_stack_id, customer_id, fingerprint },
    auth,
  });

  return response.body;
};
