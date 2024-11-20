import listRoles from '../api/instance/listRoles';
import addUser from '../api/instance/addUser';
import dropUser from '../api/instance/dropUser';
export default async ({
  instanceId,
  instanceAuth,
  url
}) => {
  const roles = await listRoles({
    auth: {
      user: instanceId,
      pass: instanceId
    },
    url
  });
  if (roles.error || !roles.length) {
    return false;
  }
  const {
    role
  } = roles.find(r => r.permission.superUser);
  await addUser({
    auth: {
      user: instanceId,
      pass: instanceId
    },
    role,
    username: instanceAuth.user,
    password: instanceAuth.pass,
    url
  });
  await dropUser({
    auth: instanceAuth,
    username: instanceId,
    url
  });
  return true;
};