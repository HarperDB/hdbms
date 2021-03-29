import instanceState from '../state/instanceState';
import customFunctionsStatus from '../api/instance/customFunctionsStatus';
import getCustomFunctions from '../api/instance/getCustomFunctions';

const buildCustomFunctions = async ({ auth, url }) => {
  const { is_enabled, port, directory, error, message } = await customFunctionsStatus({ auth, url });
  const endpoints = is_enabled ? await getCustomFunctions({ auth, url }) : [];

  const custom_functions = {
    is_enabled,
    port,
    endpoints,
    directory,
    error,
    message,
  };

  instanceState.update((s) => {
    s.custom_functions = custom_functions;
  });

  return {
    custom_functions,
  };
};

export default buildCustomFunctions;
