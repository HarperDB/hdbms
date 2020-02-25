import instances from '../../../mock_data/LMS_API.instances.json';
import products from '../../../mock_data/LMS_API.products.json';
import regions from '../../../mock_data/LMS_API.aws_regions.json';
import customer from '../../../mock_data/LMS_API.customer.json';
import user from '../../../mock_data/LMS_API.user.json';
import invoices from '../../../mock_data/LMS_API.invoices.json';

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

  console.log('Calling API', endpoint);

  switch (endpoint) {
    case 'getUser':
      return user;
    case 'getCustomer':
      return customer;
    case 'getInstances':
      return instances;
    case 'getProducts':
      return products;
    case 'getRegions':
      return regions;
    case 'getCustomerInvoices':
      return invoices;
    case 'addPaymentMethod':
      return { result: true, message: 'Payment method added to account' };
    case 'removePaymentMethod':
      return { result: true, message: 'Payment method removed from account.' };
    case 'addInstance':
      return { result: true, message: 'Instance <is being created | added>', instance_id: 'guid' };
    default:
      return { error: 'unknown endpoint' };
  }
};
