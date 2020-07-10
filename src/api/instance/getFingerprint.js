import queryInstance from '../queryInstance';

export default async ({ auth, url, is_local, compute_stack_id, customer_id }) => {
  const { message } = await queryInstance({ operation: 'get_fingerprint' }, auth, url, is_local, compute_stack_id, customer_id);
  return message;
};
