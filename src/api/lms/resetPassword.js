import queryLMS from '../queryLMS';

export default async ({ email }) => {
  const response = await queryLMS({
    endpoint: 'resetPassword',
    method: 'POST',
    payload: { email },
  });
  return response;
};
