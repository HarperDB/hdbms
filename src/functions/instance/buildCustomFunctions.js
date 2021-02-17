import instanceState from '../state/instanceState';
import customApiStatus from '../api/instance/customFunctionsStatus';
import customApiEndpoints from '../api/instance/getCustomFunctions';

const buildCustomFunctions = async ({ auth, url }) => {
  const { is_enabled, port } = await customApiStatus({ auth, url });
  const endpoints = is_enabled ? await customApiEndpoints({ auth, url }) : [];

  const custom_functions = {
    is_enabled,
    port,
    endpoints,
  };

  instanceState.update((s) => {
    s.custom_functions = custom_functions;
  });

  return {
    custom_functions,
  };
};

export default buildCustomFunctions;
