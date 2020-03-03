import queryInstance from '../queryInstance';

export default async ({ auth }) => {
  const { message } = await queryInstance({ operation: 'get_fingerprint' }, auth);
  return message;
};
