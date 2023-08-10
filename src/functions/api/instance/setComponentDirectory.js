import queryInstance from '../queryInstance';

export default async ({ auth, url, project, file }) => 
  queryInstance({
    operation: {
      operation: 'set_component_directory',
      project,
      file
    },
    auth,
    url,
  });
