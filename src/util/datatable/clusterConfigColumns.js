import React from 'react';
import { ToggleButton } from '@nio/ui-kit';

import updateNode from '../../api/instance/updateNode';

const toggleCellPadding = {
  paddingTop: 3,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 2,
};

export default ({ auth, url }) => [
  {
    Header: 'instance',
    Cell: ({ original: { is_first_instance, instance_name } }) => <div className={`${is_first_instance ? 'text-bold' : 'text-grey'}`}>{instance_name}</div>,
    style: { paddingTop: 10 },
  },
  {
    Header: 'schema',
    Cell: ({ original: { is_first_schema, schema } }) => <div className={`${is_first_schema ? 'text-bold' : 'text-grey'}`}>{schema}</div>,
    style: { paddingTop: 10 },
  },
  {
    Header: 'table',
    accessor: 'table',
    style: {
      paddingTop: 10,
      fontWeight: 700,
    },
  },
  {
    Header: 'publish',
    Cell: ({ original: { compute_stack_id, instance_host, clusterPort, subscriptions, publish, channel } }) => (
      <ToggleButton
        width={75}
        checked={publish || false}
        onChange={() =>
          updateNode({
            compute_stack_id,
            instance_host,
            clusterPort,
            subscriptions,
            publish,
            channel,
            buttonState: 'togglePublish',
            auth,
            url,
          })
        }
      />
    ),
    width: 80,
    style: toggleCellPadding,
  },
  {
    Header: 'subscribe',
    Cell: ({ original: { compute_stack_id, instance_host, clusterPort, subscriptions, subscribe, channel } }) => (
      <ToggleButton
        width={75}
        checked={subscribe || false}
        onChange={() =>
          updateNode({
            compute_stack_id,
            instance_host,
            clusterPort,
            subscriptions,
            subscribe,
            channel,
            buttonState: 'toggleSubscribe',
            auth,
            url,
          })
        }
      />
    ),
    width: 80,
    style: toggleCellPadding,
  },
];
