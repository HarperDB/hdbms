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

/*
 * To support hdb <= 4.1 using current UI features,
 * adapt custom functions data to current data requirements.
 *
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

// for 4.1 custom functions that have to be shoe-horned into
// the filebrowser structure.

function appToCf(appData) {

  const cfData = appData.entries.reduce((projectMemo, project) => {

    projectMemo[project.name] = project.entries.reduce((directoryMemo, directory) => {
      directoryMemo[directory.name] = directory.entries.map(filename => filename.split('.')[0]);
      return directoryMemo;
    }, {});

    return projectMemo;

  }, {});

  return cfData;

}

const buildCustomFunctions = async ({ auth, url }) => {
  const { is_enabled, port, directory, error, message } = await customFunctionsStatus({ auth, url });

  // TODO: [] should be {}
  // TODO: rename endpoints to file tree or something more descriptive
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
