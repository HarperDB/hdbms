import React from 'react';
import { Button, ToggleButton } from '@nio/ui-kit';

import connectToInstance from './connectToInstance';
import updateInstanceSubscription from './updateInstanceSubscription';

const toggleCellPadding = { paddingTop: 3, paddingBottom: 0, paddingLeft: 0, paddingRight: 2 };

export default ({ auth, refreshInstance }) => [{
  Header: 'name',
  accessor: 'instance_name',
  style: { paddingTop: 10 },
}, {
  Header: 'url',
  accessor: 'url',
  style: { paddingTop: 10 },
}, {
  Header: 'publish',
  Cell: ({
    original: { id, host, port, clusterPort, publish, connection, channel, subscriptions },
  }) => (
    connection
      ? <ToggleButton width={75} checked={publish || false} onChange={() => updateInstanceSubscription({ channel, subscriptions, buttonState: 'togglePublish', id, host, clusterPort, auth, refreshInstance })} />
      : <Button color="purple" className="connect" block onClick={() => connectToInstance({ id, host, port, clusterPort, auth, refreshInstance })}>connect</Button>),
  width: 80,
  style: toggleCellPadding,
}, {
  Header: 'subscribe',
  Cell: ({
    original: { id, host, clusterPort, subscribe, connection, channel, subscriptions },
  }) => (
    connection
      ? <ToggleButton width={75} checked={subscribe || false} onChange={() => updateInstanceSubscription({ channel, subscriptions, buttonState: 'toggleSubscribe', id, host, clusterPort, auth, refreshInstance })} />
      : ''
  ),
  width: 80,
  style: toggleCellPadding,
}];
