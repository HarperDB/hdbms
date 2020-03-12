export default async ({ endpoint, payload, auth }) => {
  console.log('Querying LMS API', endpoint);

  try {
    const request = await fetch(
      `https://dfu2a1toa9.execute-api.us-west-2.amazonaws.com/Prod/${endpoint}`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
          authorization: auth ? `Basic ${btoa(`${auth.email}:${auth.pass}`)}` : undefined,
        },
      },
    );
    const response = await request.json();

    if (response.errorType) {
      return {
        body: {
          result: false,
          message: response.errorMessage,
          eType: response.errorType,
        },
      };
    }
    return response;
  } catch (e) {
    return {
      body: {
        result: false,
        message: e.toString(),
        eType: 'catch',
      },
    };
  }
};
