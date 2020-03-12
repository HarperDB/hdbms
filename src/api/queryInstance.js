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

    const response = await request.json();

    if (response.error) {
      return {
        error: true,
        message: response.error,
      };
    }

    if (request.status !== 200) {
      return {
        error: true,
        message: `Error of type ${request.status}`,
      };
    }

    return response;
  } catch (e) {
    return {
      error: true,
      message: e,
    };
  }
};
