import queryLMS from '../queryLMS';

export default async () => {
  const response = await queryLMS({
    endpoint: 'getRegions',
    method: 'POST',
  });
  return response.body.sort((a, b) => (a.label < b.label ? 1 : -1));
};
