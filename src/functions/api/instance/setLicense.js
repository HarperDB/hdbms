import queryInstance from '../queryInstance';

export default async ({ auth, key, company, url, compute_stack_id, customer_id }) =>
  queryInstance(
    {
      operation: 'set_license',
      key,
      company,
    },
    auth,
    url,
    compute_stack_id,
    customer_id
  );
