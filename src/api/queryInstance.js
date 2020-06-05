import { fetch } from 'whatwg-fetch';

export default async (operation, auth, url, signal = undefined) => {
  // eslint-disable-next-line no-console
  // console.log('Querying Instance API', operation.operation);

  try {
    const request = await fetch(url, {
      signal,
      method: 'POST',
      body: JSON.stringify(operation),
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${btoa(`${auth.user}:${auth.pass}`)}`,
      },
    });

    const response = await request.json();
    let attribute_error = false;

    if (response.unauthorized_access) {
      attribute_error = [];
      response.unauthorized_access.map((error) => attribute_error.push(error.required_attribute_permissions[0].attribute_name));
    }

    if (response.error) {
      return {
        error: true,
        message: response.error,
        type: 'response',
        attribute_error,
      };
    }

    if (request.status !== 200) {
      return {
        error: true,
        message: `Error of type ${request.status}`,
        type: 'status',
      };
    }

    return response;
  } catch (e) {
    return {
      error: true,
      message: e,
      type: 'catch',
    };
  }
};
