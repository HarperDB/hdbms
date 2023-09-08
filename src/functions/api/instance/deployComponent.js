import queryInstance from '../queryInstance';

export default async ({ auth, url, project, packageUrl }) => { 

  await queryInstance({
    auth,
    url,
    operation: {
      operation: 'deploy_component',
      project,
      package: packageUrl
    }
  });

}
