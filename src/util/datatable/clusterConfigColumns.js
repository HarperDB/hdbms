import React from 'react';
import { Button, ToggleButton } from '@nio/ui-kit';

import addNode from '../../api/instance/addNode';
import removeNode from '../../api/instance/removeNode';
import updateNode from '../../api/instance/updateNode';

const toggleCellPadding = { paddingTop: 3, paddingBottom: 0, paddingLeft: 0, paddingRight: 2 };

export default ({ auth, refreshInstance, url, registerInstance }) => [{
  Header: 'name',
  accessor: 'instance_name',
  style: { paddingTop: 10 },
}, {
  Header: 'studio-registered',
  Cell: ({
    original: { registered, instance_name, instance_host, clusterPort },
  }) => (
    registered ? (
      <div className="pl-2">
        <i className="fa fa-2x fa-check-circle text-success" />
      </div>
    ) : (
      <div style={{ paddingRight: 10 }}>
        <Button color="purple" className="datatable mr-2" onClick={registerInstance}>
          register
        </Button>
        <Button color="danger" className="datatable" onClick={() => removeNode({ instance_name, instance_host, clusterPort, auth, url, refreshInstance })}>
          remove
        </Button>
      </div>
    )
  ),
  width: 200,
  style: toggleCellPadding,
}, {
  Header: 'connection',
  Cell: ({
    original: { registered, instance_name, instance_host, instance_status, clusterPort, connection },
  }) => (
    instance_host === 'localhost' ? (
      <div style={{ paddingTop: 6 }}>
        <i className="fa text-danger fa-exclamation-triangle mr-2" />
        unreachable domain: {instance_host}
      </div>
    ) : instance_status === 'CREATE_IN_PROGRESS' ? (
      <div style={{ paddingTop: 6 }} className="text-bold">
        <i className="text-purple fa fa-spin fa-spinner mr-2" />
        creating instance
      </div>
    ) : connection ? (
      <div style={{ paddingRight: 10 }}>
        <Button color="danger" className="datatable" onClick={() => removeNode({ instance_name, instance_host, clusterPort, auth, url, refreshInstance })}>
          disconnect
        </Button>
      </div>
    ) : registered ? (
      <div style={{ paddingRight: 10 }}>
        <Button color="success" className="datatable" onClick={() => addNode({ instance_name, instance_host, clusterPort, auth, url, refreshInstance })}>
          connect
        </Button>
      </div>
    ) : null
  ),
  width: 100,
  style: toggleCellPadding,
}, {
  Header: 'publish',
  Cell: ({
    original: { instance_name, instance_host, clusterPort, publish, connection, channel, subscriptions },
  }) => (
    connection ? (
      <ToggleButton
        width={75}
        checked={publish || false}
        onChange={() => updateNode({ channel, subscriptions, buttonState: 'togglePublish', instance_name, instance_host, clusterPort, auth, url, refreshInstance })}
      />
    ) : null
  ),
  width: 80,
  style: toggleCellPadding,
}, {
  Header: 'subscribe',
  Cell: ({
    original: { instance_name, instance_host, clusterPort, subscribe, connection, channel, subscriptions },
  }) => (
    connection ? (
      <ToggleButton
        width={75}
        checked={subscribe || false}
        onChange={() => updateNode({ channel, subscriptions, buttonState: 'toggleSubscribe', instance_name, instance_host, clusterPort, auth, url, refreshInstance })}
      />
    ) : (
      ''
    )
  ),
  width: 80,
  style: toggleCellPadding,
}];
