import { fetch } from 'whatwg-fetch';

import config from '../config';

import addError from './lms/addError';

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

    const json = await request.json();

    const response = json.body || json;

    /*
    addError({
      type: 'lms api',
      status: 'error',
      url: config.lms_api_url,
      operation: endpoint,
      request: payload,
      error: response,
      customer_id: payload?.customer_id,
      compute_stack_id: payload?.compute_stack_id,
    });
    */

    if (response.errorType) {
      addError({
        type: 'lms api',
        status: 'error',
        url: config.lms_api_url,
        operation: endpoint,
        request: payload,
        error: response,
        customer_id: payload?.customer_id,
        compute_stack_id: payload?.compute_stack_id,
      });

      return {
        error: true,
        message: response.errorMessage,
      };
    }

    if (response.error) {
      if (!payload.loggingIn) {
        addError({
          type: 'lms api',
          status: 'error',
          url: config.lms_api_url,
          operation: endpoint,
          request: payload,
          error: response,
          customer_id: payload?.customer_id,
          compute_stack_id: payload?.compute_stack_id,
        });
      }

      return {
        error: true,
        message:
          response.message.replace(/Validation error:|Throttling error:|Bad request:|Internal Server Error:|Unauthorized:|StripeInvalidRequestError:|TypeError:/g, '').trim() ||
          'The server did not respond',
      };
    }

    return response;
  } catch (e) {
    if (e.message !== 'Aborted') {
      addError({
        type: 'lms api',
        status: 'error',
        url: config.lms_api_url,
        operation: endpoint,
        request: payload,
        error: { catch: e.message },
        customer_id: payload?.customer_id,
        compute_stack_id: payload?.compute_stack_id,
      });
    }

    return {
      error: true,
      message: e.message,
    };
  }
};
