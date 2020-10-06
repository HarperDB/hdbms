import queryLMS from '../queryLMS';

export default async ({ email }) =>
  queryLMS({
    endpoint: 'resendRegistrationEmail',
    method: 'POST',
    payload: { email },
  });
