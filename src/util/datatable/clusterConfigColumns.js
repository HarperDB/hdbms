import React from 'react';
import { Button, ToggleButton } from '@nio/ui-kit';

import addNode from '../../api/instance/addNode';
import updateNode from '../../api/instance/updateNode';

const toggleCellPadding = { paddingTop: 3, paddingBottom: 0, paddingLeft: 0, paddingRight: 2 };

export default ({ auth, refreshInstance, url }) => [{
  Header: 'name',
  accessor: 'instance_name',
  style: { paddingTop: 10 },
}, {
  Header: 'url',
  accessor: 'instance_url',
  style: { paddingTop: 10 },
}, {
  Header: 'publish',
  Cell: ({
    original: { instance_name, instance_host, instance_status, clusterPort, publish, connection, channel, subscriptions },
  }) => (
    instance_host === 'localhost' ? (
      <div style={{ paddingTop: 6, paddingLeft: 10 }} className="text-purple text-bold"><i className="fa fa-exclamation-triangle mr-2" />unreachable domain</div>
    ) : instance_status === 'CREATE_IN_PROGRESS' ? (
      <div style={{ paddingTop: 6, paddingLeft: 10 }} className="text-purple text-bold"><i className="fa fa-spin fa-spinner mr-2" />creating instance</div>
    ) : connection ? (
      <ToggleButton width={75} checked={publish || false} onChange={() => updateNode({ channel, subscriptions, buttonState: 'togglePublish', instance_name, instance_host, clusterPort, auth, url, refreshInstance })} />
    ) : (
      <Button color="purple" className="connect" block onClick={() => addNode({ instance_name, instance_host, clusterPort, auth, url, refreshInstance })}>connect</Button>
    )
  ),
  width: 80,
  style: toggleCellPadding,
}, {
  Header: 'subscribe',
  Cell: ({
    original: { instance_name, instance_host, clusterPort, subscribe, connection, channel, subscriptions },
  }) => (
    connection
      ? <ToggleButton width={75} checked={subscribe || false} onChange={() => updateNode({ channel, subscriptions, buttonState: 'toggleSubscribe', instance_name, instance_host, clusterPort, auth, url, refreshInstance })} />
      : ''
  ),
  width: 80,
  style: toggleCellPadding,
}];
