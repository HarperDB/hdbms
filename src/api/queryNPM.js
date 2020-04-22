import { fetch } from 'whatwg-fetch';

export default async ({ signal = undefined }) => {
  // eslint-disable-next-line no-console
  // console.log('Querying LMS API', endpoint);

  try {
    const request = await fetch('https://registry.npmjs.org/harperdb', {
      signal,
      method: 'GET',
    });
    const response = await request.json();

    if (!response || response.errorType || response.errorMessage) {
      return {
        body: {
          result: false,
          message: response?.errorMessage || 'The server did not respond',
        },
      };
    }

    const number = response['dist-tags'].latest;
    const location = response.versions[number].dist.tarball;

    return {
      number,
      location,
    };
  } catch (e) {
    return {
      body: {
        result: false,
        message: e.toString(),
      },
    };
  }
};
