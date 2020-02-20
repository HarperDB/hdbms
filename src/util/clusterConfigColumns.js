import React from 'react';
import { Button, ToggleButton } from '@nio/ui-kit';

import connectToInstance from './connectToInstance';
import updateInstanceSubscription from './updateInstanceSubscription';

export default ({ auth, refreshInstance }) => [{
  Header: 'name',
  accessor: 'name',
  style: { paddingTop: 10 },
}, {
  Header: 'url',
  accessor: 'url',
  style: { paddingTop: 10 },
}, {
  Header: 'publish',
  Cell: ({
    original: { id, host, port, clusterPort, publish, connection, channel, subscriptions }
  }) => (
    connection
      ? <ToggleButton inactiveLabel="off" activeLabel="on" value={publish} onToggle={() => updateInstanceSubscription({ channel, subscriptions, buttonState: 'togglePublish', id, host, clusterPort, auth, refreshInstance })} />
      : <Button color="purple" className="connect" block onClick={() => connectToInstance({ id, host, port, clusterPort, auth, refreshInstance })}>connect</Button>),
  width: 79,
  style: { paddingTop: 2, paddingBottom: 2, paddingLeft: 5, paddingRight: 5 },
}, {
  Header: 'subscribe',
  Cell: ({
    original: { id, host, clusterPort, subscribe, connection, channel, subscriptions }
  }) => (
    connection
      ? <ToggleButton inactiveLabel="off" activeLabel="on" value={subscribe} onToggle={() => updateInstanceSubscription({ channel, subscriptions, buttonState: 'toggleSubscribe', id, host, clusterPort, auth, refreshInstance })} />
      : ''
  ),
  width: 79,
  style: { paddingTop: 2, paddingBottom: 2, paddingLeft: 5, paddingRight: 5 },
}];
