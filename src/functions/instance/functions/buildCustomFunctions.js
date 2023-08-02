import instanceState from '../../state/instanceState';
import customFunctionsStatus from '../../api/instance/customFunctionsStatus';
import getCustomFunctions from '../../api/instance/getCustomFunctions';

/*
 * {
 *  endpoint1: {
 *    routes: [],
 *    helpers: []
 *  },
 *  endpoint2: {
 *    routes: [],
 *    helpers: []
 *  }
 * }
 *
 * {
 *  name: 'components',
 *  entries: [
 *    name: endpoint1,
 *    entries: [
 *       {
 *          name: 'routes',
 *          entries: []
 *       }
 *    ]
 *  ],
 * }
 */

function cfToApp(cfData) {

  const appData = {
    name: 'components',
    entries: []
  };


  const endpoints = Object.keys(cfData);

  for (let i = 0, endpoint = endpoints[i]; i < endpoints.length; i+=1) {
    const endpointTree = {
      name: endpoint,
      entries: [
        {
          name: 'routes',
          entries: cfData[endpoint].routes.map(f => `${f}.js`)
        },
        {
          name: 'helpers',
          entries: cfData[endpoint].helpers.map(f => `${f}.js`)
        }
      ]
    };
    appData.entries.push(endpointTree)
  }

  return appData;

}

function appToCf(appData) {

  const cfData = {};

  return cfData;

}


const buildCustomFunctions = async ({ auth, url }) => {
  const { is_enabled, port, directory, error, message } = await customFunctionsStatus({ auth, url });
  const endpoints = is_enabled ? await getCustomFunctions({ auth, url }) : [];

  const appData = cfToApp(endpoints);
  const cfData = appToCf(appData);


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
