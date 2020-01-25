import instances from '../../mock_data/LMS_API.instances.json';

export default async ({ endpoint, method, payload, auth }) => {
  /*
  const request = await fetch(
    `https://api.harperdb.io/v1/${endpoint}`,
    {
      method,
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${btoa(`${auth.user}:${auth.pass}`)}`,
      },
    },
  );
  return request.json();
  */

  switch (endpoint) {
    case 'getInstances':
      return instances;
    default:
      return { error: 'unknown endpoint' };
  }
};
