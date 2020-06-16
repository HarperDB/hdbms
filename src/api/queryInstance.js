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
