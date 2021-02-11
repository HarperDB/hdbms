import addUser from '../api/instance/addUser';
import queryInstance from '../api/queryInstance';

export default async ({ username, password, role, auth, url }) => {
  const userResult = await addUser({ username, password, role, auth, url });

  if (userResult.message.indexOf('successfully') === -1) {
    return userResult;
  }

  return queryInstance({
    operation: {
      operation: 'configure_cluster',
      CLUSTERING_USER: username,
    },
    auth,
    url,
  });
};
