import queryInstance from './queryInstance';

export default async ({ channel, subscriptions, buttonState, id, host, clusterPort, auth, refreshInstance }) => {
  const existingChannelSubscriptionIndex = subscriptions.findIndex((s) => s.channel === channel);

  // if we have no subscription for this node, add it to the subscriptions array
  if (existingChannelSubscriptionIndex === -1) {
    subscriptions.push({
      channel,
      publish: buttonState === 'togglePublish',
      subscribe: buttonState === 'toggleSubscribe',
    });

  // if we're changing the publish status
  } else if (buttonState === 'togglePublish') {
    subscriptions[existingChannelSubscriptionIndex].publish = !subscriptions[existingChannelSubscriptionIndex].publish;

  // if we're changing the subscribe status
  } else if (buttonState === 'toggleSubscribe') {
    subscriptions[existingChannelSubscriptionIndex].subscribe = !subscriptions[existingChannelSubscriptionIndex].subscribe;
  }

  // get rid of subscription node if it's neither publishing or subscribing
  if (subscriptions[existingChannelSubscriptionIndex] && !subscriptions[existingChannelSubscriptionIndex].publish && !subscriptions[existingChannelSubscriptionIndex].subscribe) {
    subscriptions.splice(existingChannelSubscriptionIndex, 1);
  }

  // send the query
  const operation = { operation: 'update_node', name: id, host, port: clusterPort, subscriptions };
  await queryInstance(operation, auth);
  return setTimeout(() => refreshInstance(Date.now()), 100);
};
