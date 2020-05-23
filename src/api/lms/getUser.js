import queryLMS from '../queryLMS';

export default async ({ email, pass }) => {
  const response = queryLMS({
    endpoint: 'getUser',
    method: 'POST',
    payload: { email, password: pass },
  });

  if (response.error) {
    return response;
  }

  if (!response.orgs) {
    response.orgs = [
      {
        customer_id: response.customer_id,
        customer_name: `${response.firstname}'s Org`,
        status: 'owner',
      },
    ];
  } else if (!Array.isArray(response.orgs)) {
    response.orgs = [response.orgs];
  }

  return response;
};
