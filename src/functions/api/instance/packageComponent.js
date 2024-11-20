import queryInstance from '../queryInstance';
export default async ({
  auth,
  url,
  project,
  skipNodeModules = true
}) => queryInstance({
  auth,
  url,
  operation: {
    operation: 'package_component',
    project,
    skipNodeModules
  }
});