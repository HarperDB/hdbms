export default async (operation, auth) => {
  console.log('Querying Instance API', operation.operation);

  const request = await fetch(
    `${auth.is_ssl ? 'https://' : 'http://'}${auth.host}:${auth.port}`,
    {
      method: 'POST',
      body: JSON.stringify(operation),
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${btoa(`${auth.user}:${auth.pass}`)}`,
      },
    },
  );
  return request.json();
};
