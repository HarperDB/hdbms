import queryInstance from '../queryInstance';

export default async ({ username, password, role, auth, refreshInstance, url }) => {
  const query = {
    operation: 'add_user',
    role,
    username,
    password,
    active: true,
  };
  const result = await queryInstance(query, auth, url);
  refreshInstance(Date.now());
  return result;
};
