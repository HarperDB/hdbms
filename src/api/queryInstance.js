export default async (operation, auth, url) => {
  console.log('Querying Instance API', operation.operation);

  try {
    const request = await fetch(
      url,
      {
        method: 'POST',
        body: JSON.stringify(operation),
        headers: {
          'Content-Type': 'application/json',
          authorization: `Basic ${btoa(`${auth.user}:${auth.pass}`)}`,
        },
      },
    );
    if (request.status !== 200) {
      return {
        error: true,
        message: request.status,
      };
    }
    return request.json();
  } catch (e) {
    return {
      error: true,
      message: e,
    };
  }
};
