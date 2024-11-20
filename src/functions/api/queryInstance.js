import { fetch } from 'whatwg-fetch';
export default async ({
  operation,
  auth,
  url,
  timeout = 0,
  authType = undefined,
  signal = undefined
}) => {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => timeout ? controller.abort() : null, timeout);
    const request = await fetch(url, {
      signal: signal || controller.signal,
      method: 'POST',
      body: JSON.stringify(operation),
      headers: {
        'Content-Type': 'application/json',
        authorization: authType === 'token' ? `Bearer ${auth.token}` : `Basic ${btoa(`${auth.user}:${auth.pass}`)}`
      }
    });
    clearTimeout(id);
    const response = await request.json();
    if (response.error) {
      return {
        error: true,
        message: response.error,
        type: 'response',
        roleErrors: response.mainPermissions?.join(', '),
        accessErrors: response.unauthorizedAccess?.map(e => ({
          schema: e.schema,
          table: e.table,
          type: e.requiredAttributePermissions?.length ? 'attribute' : 'table',
          entity: e.requiredAttributePermissions?.length ? e.requiredAttributePermissions[0]?.attributeName : e.table,
          permission: e.requiredAttributePermissions?.length ? e.requiredAttributePermissions[0]?.requiredPermissions.join(', ') : e.requiredTablePermissions?.join(', ')
        }))
      };
    }
    if (request.status !== 200) {
      return {
        error: true,
        message: `Error of type ${request.status}`,
        type: 'status'
      };
    }
    return response;
  } catch (e) {
    return {
      error: true,
      message: e.message,
      type: 'catch'
    };
  }
};