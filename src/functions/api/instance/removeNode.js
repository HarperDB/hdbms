import queryInstance from '../queryInstance';
export default async ({
  computeStackId,
  auth,
  url
}) => queryInstance({
  operation: {
    operation: 'remove_node',
    name: computeStackId,
    nodeName: computeStackId
  },
  auth,
  url
});