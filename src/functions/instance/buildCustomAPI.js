import listUsers from '../api/instance/listUsers';
import listRoles from '../api/instance/listRoles';
import instanceState from '../state/instanceState';
import customApiStatus from '../api/instance/customApiStatus';
import createCustomAPIUserConfig from './createCustomAPIUserConfig';

const buildCustomAPI = async ({ auth, url }) => {
  const roles = await listRoles({ auth, url });
  const users = await listUsers({ auth, url });
  const { is_enabled, custom_api_port, custom_api_endpoints, custom_api_username } = await customApiStatus({ auth, url });

  const custom_api_role = roles.find((r) => r.role === 'custom_api_user');
  const custom_api_user = custom_api_role && users.find((u) => u.role === 'custom_api_user');

  if (custom_api_user && !custom_api_username) {
    await createCustomAPIUserConfig({ username: custom_api_user, auth, url });
  }

  const custom_api = {
    is_enabled,
    custom_api_role: custom_api_role?.id,
    custom_api_user: custom_api_user?.username,
    custom_api_port,
    custom_api_endpoints,
  };

  instanceState.update((s) => {
    s.custom_api = custom_api;
  });

  return {
    custom_api,
  };
};

export default buildCustomAPI;
