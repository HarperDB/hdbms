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
      console.log('status', request.status);
      return {
        error: true,
        message: request.status,
      };
    }
    return await request.json();
  } catch (e) {
    console.log('catch', e);
    return {
      error: true,
      message: e,
    };
  }
};
