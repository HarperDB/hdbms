import queryLMS from '../queryLMS';

export default async ({ auth, payload: { customer_id, instance_id } }) => {
  const response = await queryLMS({
    endpoint: 'removeInstance',
    method: 'POST',
    payload: { customer_id, instance_id },
    auth,
  });

  return response.body;
};
