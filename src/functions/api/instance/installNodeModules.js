import queryInstance from '../queryInstance';
export default async ({
  auth,
  url,
  projects,
  dryRun = false
}) => queryInstance({
  operation: {
    operation: 'install_node_modules',
    projects,
    dryRun
  },
  auth,
  url
});