import { fetch } from 'whatwg-fetch';
import addError from './lms/addError';

export default async (operation, auth, url, is_local = false, compute_stack_id = false, customer_id = false, signal = undefined) => {
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

    /*
    addError({
      type: 'instance api TEST',
      status: is_local ? 'warn' : 'error',
      url,
      operation: operation.operation,
      request: operation,
      error: { error: true, message: 'this is a test error' },
      compute_stack_id,
      customer_id,
    });
    */

    if (response.error) {
      addError({
        type: 'instance api',
        status: is_local ? 'warn' : 'error',
        url,
        operation: operation.operation,
        request: operation,
        error: response,
        compute_stack_id,
        customer_id,
      });

      return {
        error: true,
        message: response.error,
        type: 'response',
        access_errors: response.unauthorized_access?.map((e) => ({
          schema: e.schema,
          table: e.table,
          type: e.required_attribute_permissions.length ? 'attribute' : 'table',
          entity: e.required_attribute_permissions.length ? e.required_attribute_permissions[0].attribute_name : e.table,
          permission: e.required_attribute_permissions.length ? e.required_attribute_permissions[0].required_permissions.join(', ') : e.required_table_permissions.join(', '),
        })),
      };
    }

    if (request.status !== 200) {
      addError({
        type: 'instance api',
        status: is_local ? 'warn' : 'error',
        url,
        operation: operation.operation,
        request: operation,
        error: { status: `Error of type ${request.status}` },
        compute_stack_id,
        customer_id,
      });

      return {
        error: true,
        message: `Error of type ${request.status}`,
        type: 'status',
      };
    }

    return response;
  } catch (e) {
    if (e.message !== 'Aborted' && !['registration_info', 'user_info'].includes(operation.operation)) {
      addError({
        type: 'instance api',
        status: is_local ? 'warn' : 'error',
        url,
        operation: operation.operation,
        request: operation,
        error: { catch: e.message },
        compute_stack_id,
        customer_id,
      });
    }

    return {
      error: true,
      message: e.message,
      type: 'catch',
    };
  }
};
