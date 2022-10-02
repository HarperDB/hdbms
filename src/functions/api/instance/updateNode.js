import queryInstance from '../queryInstance';
import instanceState from '../../state/instanceState';

export default async ({ channel, subscriptions, buttonState, compute_stack_id, instance_host, clusterPort, auth, url }) => {
  const newSubscriptions = JSON.parse(JSON.stringify(subscriptions));
  const existingChannelSubscriptionIndex = newSubscriptions.findIndex((s) => s.channel === channel);
  const [schema, table] = channel.split(':');

  // if we have no subscription for this node, add it to the subscriptions array
  if (existingChannelSubscriptionIndex === -1) {
    newSubscriptions.push({
      channel,
      schema,
      table,
      publish: buttonState === 'togglePublish',
      subscribe: buttonState === 'toggleSubscribe',
    });

    // if we're changing the publish status
  } else if (buttonState === 'togglePublish') {
    newSubscriptions[existingChannelSubscriptionIndex].publish = !newSubscriptions[existingChannelSubscriptionIndex].publish;

    // if we're changing the subscribe status
  } else if (buttonState === 'toggleSubscribe') {
    newSubscriptions[existingChannelSubscriptionIndex].subscribe = !newSubscriptions[existingChannelSubscriptionIndex].subscribe;
  }

  // get rid of subscription node if it's neither publishing or subscribing
  if (
    newSubscriptions[existingChannelSubscriptionIndex] &&
    !newSubscriptions[existingChannelSubscriptionIndex].publish &&
    !newSubscriptions[existingChannelSubscriptionIndex].subscribe
  ) {
    newSubscriptions.splice(existingChannelSubscriptionIndex, 1);
  }

  // send the query
  const updateResult = await queryInstance({
    operation: {
      operation: 'update_node',
      name: compute_stack_id,
      node_name: compute_stack_id,
      host: instance_host,
      port: clusterPort,
      startTime: new Date().toISOString(),
      subscriptions: newSubscriptions,
    },
    auth,
    url,
  });

  if (updateResult.error && parseFloat(auth.version) >= 4) {
    await queryInstance({
      operation: {
        operation: 'add_node',
        node_name: compute_stack_id,
        startTime: new Date().toISOString(),
        subscriptions: newSubscriptions,
      },
      auth,
      url,
    });
  }


  return instanceState.update((s) => {
    s.lastUpdate = Date.now();
  });
};
