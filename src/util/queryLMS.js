import instances from '../../mock_data/LMS_API.instances.json';
import products from '../../mock_data/LMS_API.products.json';
import regions from '../../mock_data/LMS_API.aws_regions.json';

// eslint-disable-next-line no-unused-vars
export default async ({ endpoint, payload, auth }) => {
  /*
  const request = await fetch(
    `https://api.harperdb.io/v1/${endpoint}`,
    {
      method: 'POST',
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
    case 'getProducts':
      return products;
    case 'getRegions':
      return regions;
    default:
      return { error: 'unknown endpoint' };
  }
};
