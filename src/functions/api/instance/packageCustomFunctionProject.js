import queryInstance from '../queryInstance';
export default async ({
  auth,
  url,
  project,
  skipNodeModules
}) => queryInstance({
  operation: {
    operation: 'package_custom_function_project',
    project,
    skipNodeModules
  },
  auth,
  url
});