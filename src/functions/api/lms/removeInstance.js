import queryLMS from '../queryLMS';

export default async ({ auth, customer_id, compute_stack_id }) =>
  queryLMS({
    endpoint: 'removeInstance',
    method: 'POST',
    payload: {
      customer_id,
      compute_stack_id,
    },
    auth,
  });
