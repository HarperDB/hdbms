import { fetch } from 'whatwg-fetch';
import config from '../../../config';

export default async ({ type = 'studio component', url = undefined, operation = undefined, request = undefined, error, customer_id = undefined, compute_stack_id = undefined }) => {
  const user = JSON.parse(localStorage.getItem('persistedUser'));

  const body = {
    type,
    user: user?.email,
    customer_id,
    compute_stack_id,
    url,
    operation,
    request,
    error,
    timestamp: Date.now(),
  };

  const result = await fetch(`${config.lms_api_url}addError`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      authorization: undefined,
    },
  });

  const json = await result.json();

  const response = json.body || json;

  if (!response.error) {
    // eslint-disable-next-line no-console
    console.log('Reported error: ', type, operation);
  }
};