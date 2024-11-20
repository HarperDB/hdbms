import React from 'react';
import ToggleButton from 'react-toggle';
import updateNode from '../../api/instance/updateNode';
export default ({
  auth,
  url,
  buildNetwork,
  setLoading
}) => [{
  Header: 'instance',
  Cell: ({
    row: {
      original: {
        isFirstInstance,
        instanceName
      }
    }
  }) => <div className={`${isFirstInstance ? 'text-bold' : 'text-grey'}`}>{instanceName}</div>
}, {
  Header: 'schema',
  // change to 'database' if instance version is 4.2+ and clustering available in studio cloud instances.
  Cell: ({
    row: {
      original: {
        isFirstSchema,
        schema
      }
    }
  }) => <div className={`${isFirstSchema ? 'text-bold' : 'text-grey'}`}>{schema}</div>
}, {
  Header: 'table',
  accessor: 'table'
}, {
  Header: 'publish',
  id: 'hdb-narrow-publish',
  Cell: ({
    row: {
      original: {
        computeStackId,
        instanceHost,
        instanceName,
        clusterPort,
        clusterName,
        subscriptions,
        publish,
        channel
      }
    }
  }) => <ToggleButton checked={publish || false} onChange={async () => {
    setLoading(computeStackId);
    await updateNode({
      channel,
      subscriptions,
      instanceHost,
      instanceName,
      clusterPort,
      clusterName,
      auth,
      url,
      buttonState: 'togglePublish'
    });
    buildNetwork();
  }} />
}, {
  Header: 'subscribe',
  id: 'hdb-narrow-subscribe',
  Cell: ({
    row: {
      original: {
        computeStackId,
        instanceHost,
        instanceName,
        clusterPort,
        clusterName,
        subscriptions,
        subscribe,
        channel
      }
    }
  }) => <ToggleButton checked={subscribe || false} onChange={async () => {
    setLoading(computeStackId);
    await updateNode({
      channel,
      subscriptions,
      instanceHost,
      instanceName,
      clusterPort,
      clusterName,
      auth,
      url,
      buttonState: 'toggleSubscribe'
    });
    buildNetwork();
  }} />
}];