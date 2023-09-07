import queryInstance from '../queryInstance';

export default async ({ auth, url, project }) => 
  queryInstance({
    operation: {
      operation: 'deploy_component',
      project,
      file
    },
    auth,
    url,
  });
