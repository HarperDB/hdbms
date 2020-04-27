import { fetch } from 'whatwg-fetch';

import config from '../../config';

export default async ({ endpoint, payload, auth, signal = undefined }) => {
  // eslint-disable-next-line no-console
  // console.log('Querying LMS API', endpoint);

  try {
    const request = await fetch(`${config.lms_api_url}${endpoint}`, {
      signal,
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        authorization: auth ? `Basic ${btoa(`${auth.email}:${auth.pass}`)}` : undefined,
      },
    });

    const { body } = await request.json();

    if (body.error) {
      return {
        error: true,
        message:
          body.message.replace(/Validation error:|Throttling error:|Bad request:|Internal Server Error:|Unauthorized:|StripeInvalidRequestError:/g, '') ||
          'The server did not respond',
      };
    }

    return body;
  } catch (e) {
    return {
      error: true,
      message: e.toString(),
    };
  }
};
