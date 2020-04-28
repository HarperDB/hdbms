import queryLMS from '../queryLMS';

export default async ({ subdomain }) => {
  const response = await queryLMS({
    endpoint: 'checkSubdomain',
    method: 'POST',
    payload: { subdomain },
  });
  return response;
};
