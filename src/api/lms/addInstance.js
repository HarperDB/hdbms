import queryLMS from '../queryLMS';

export default async ({ auth, ...rest }) => {
  const response = await queryLMS({
    endpoint: 'addInstance',
    method: 'POST',
    payload: { ...rest },
    auth,
  });

  return response;
};
