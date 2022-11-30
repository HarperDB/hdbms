import React from 'react';
import ToggleButton from 'react-toggle';

import updateNode from '../api/instance/updateNode';

export default ({ auth, url, is_local, customer_id, buildNetwork, setLoading }) => [
  {
    Header: 'instance',
    Cell: ({
      row: {
        original: { is_first_instance, instance_name },
      },
    }) => <div className={`${is_first_instance ? 'text-bold' : 'text-grey'}`}>{instance_name}</div>,
  },
  {
    Header: 'schema',
    Cell: ({
      row: {
        original: { is_first_schema, schema },
      },
    }) => <div className={`${is_first_schema ? 'text-bold' : 'text-grey'}`}>{schema}</div>,
  },
  {
    Header: 'table',
    accessor: 'table',
  },
  {
    Header: 'publish',
    id: 'hdb-narrow-publish',
    Cell: ({
      row: {
        original: { compute_stack_id, instance_host, clusterPort, subscriptions, publish, channel },
      },
    }) => (
      <ToggleButton
        checked={publish || false}
        onChange={async () => {
          setLoading(true);
          await updateNode({
            compute_stack_id,
            instance_host,
            clusterPort,
            subscriptions,
            publish,
            channel,
            buttonState: 'togglePublish',
            auth,
            url,
            is_local,
            customer_id,
          });
          buildNetwork();
        }}
      />
    ),
  },
  {
    Header: 'subscribe',
    id: 'hdb-narrow-subscribe',
    Cell: ({
      row: {
        original: { compute_stack_id, instance_host, clusterPort, subscriptions, subscribe, channel },
      },
    }) => (
      <ToggleButton
        checked={subscribe || false}
        onChange={async () => {
          setLoading(true);
          await updateNode({
            compute_stack_id,
            instance_host,
            clusterPort,
            subscriptions,
            subscribe,
            channel,
            buttonState: 'toggleSubscribe',
            auth,
            url,
            is_local,
            customer_id,
          });
          buildNetwork();
        }}
      />
    ),
  },
];
