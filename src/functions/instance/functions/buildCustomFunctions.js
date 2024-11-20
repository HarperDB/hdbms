import instanceState from '../../state/instanceState';
import customFunctionsStatus from '../../api/instance/customFunctionsStatus';
import getCustomFunctions from '../../api/instance/getCustomFunctions';
import getComponents from '../../api/instance/getComponents';
const buildCustomFunctions = async ({
  auth,
  url
}) => {
  const {
    isEnabled,
    port,
    directory,
    error,
    message
  } = await customFunctionsStatus({
    auth,
    url
  });
  const fileTree = await getComponents({
    auth,
    url
  });

  // TODO: [] should be {}
  // TODO: rename endpoints to file tree or something more descriptive
  const endpoints = isEnabled ? await getCustomFunctions({
    auth,
    url
  }) : {};
  const customFunctions = {
    isEnabled,
    port,
    endpoints,
    directory,
    error,
    message,
    fileTree
  };
  instanceState.update(s => {
    s.customFunctions = customFunctions;
  });
  return {
    customFunctions
  };
};
export default buildCustomFunctions;