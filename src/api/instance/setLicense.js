import queryInstance from '../queryInstance';

export default async ({ auth, key, company, url, is_local, compute_stack_id, customer_id }) =>
  queryInstance(
    {
      operation: 'set_license',
      key,
      company,
    },
    auth,
    url,
    is_local,
    compute_stack_id,
    customer_id
  );
