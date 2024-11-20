import queryInstance from '../queryInstance';
export default async ({
  computeStackId,
  instanceHost,
  clusterPort,
  auth,
  url
}) => queryInstance({
  operation: {
    operation: 'add_node',
    name: computeStackId,
    nodeName: computeStackId,
    host: instanceHost,
    port: clusterPort,
    subscriptions: []
  },
  auth,
  url
});