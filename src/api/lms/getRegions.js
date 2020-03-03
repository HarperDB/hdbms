import queryLMS from '../queryLMS';

export default async () => {
  const response = await queryLMS({
    endpoint: 'getRegions',
    method: 'POST',
    auth: { user: 'harperdb', pass: 'harperdb' },
  });
  return response.body;
};
