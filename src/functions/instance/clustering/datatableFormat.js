import deepmerge from 'deepmerge';
export default ({
  instances,
  structure
}) => {
  if (!structure || !instances.length) return [];
  const newTableData = [];
  instances.map(instance => {
    const combinedStructure = deepmerge(instance.structure, structure);
    Object.keys(combinedStructure).sort().map((schema, s) => {
      Object.keys(combinedStructure[schema]).sort().map((table, t) => {
        const channel = `${schema}:${table}`;
        const channelSubscription = channel && instance.subscriptions.find(sub => sub.channel === channel);
        const publish = channelSubscription && channelSubscription.publish;
        const subscribe = channelSubscription && channelSubscription.subscribe;
        newTableData.push({
          isFirstInstance: s === 0 && t === 0,
          isFirstSchema: t === 0,
          instanceName: instance.instanceName,
          schema,
          table,
          computeStackId: instance.computeStackId,
          instanceHost: instance.instanceHost,
          clusterPort: instance.clusterPort,
          clusterName: instance.clusterName,
          subscriptions: instance.subscriptions,
          channel,
          publish,
          subscribe
        });
        return true;
      });
      return true;
    });
    return true;
  });
  return newTableData;
};