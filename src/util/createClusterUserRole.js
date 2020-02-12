import queryInstance from './queryInstance';

export default async ({ auth, refreshInstance }) => {
  const query = {
    operation: 'add_role',
    role: 'cluster_user',
    permission: {
      cluster_user: true,
    },
  };
  const result = await queryInstance(query, auth);
  refreshInstance(Date.now());
  return result;
};
