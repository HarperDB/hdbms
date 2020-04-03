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

    if (response.error) {
      return {
        error: true,
        message: response.error,
        type: 'response',
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
