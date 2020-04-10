export default ({ instances, structure }) => {
  if (!structure || !instances.length) return [];

  const newTableData = [];
  instances.map((instance) => {
    const { instance_name, compute_stack_id, instance_host, clusterPort, subscriptions } = instance;
    Object.keys(structure)
      .sort()
      .map((schema, s) => {
        Object.keys(structure[schema])
          .sort()
          .map((table, t) => {
            const channel = `${schema}:${table}`;
            const channelSubscription = channel && subscriptions.find((sub) => sub.channel === channel);
            const publish = channelSubscription && channelSubscription.publish;
            const subscribe = channelSubscription && channelSubscription.subscribe;
            newTableData.push({
              is_first_instance: s === 0 && t === 0,
              is_first_schema: t === 0,
              instance_name,
              schema,
              table,
              compute_stack_id,
              instance_host,
              clusterPort,
              subscriptions,
              channel,
              publish,
              subscribe,
            });
            return true;
          });
        return true;
      });
    return true;
  });

  return newTableData;
};
