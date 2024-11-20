import queryInstance from '../queryInstance';
export default async ({
  auth,
  url,
  functionContent,
  project,
  type,
  file
}) => queryInstance({
  operation: {
    operation: 'set_custom_function',
    functionContent,
    project,
    type,
    file
  },
  auth,
  url
});