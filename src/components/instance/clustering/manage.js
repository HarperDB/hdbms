import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from '@nio/ui-kit';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import appState from '../../../state/stores/appState';
import instanceState from '../../../state/stores/instanceState';

import InstanceManager from './manageInstances';
import DataTable from './manageDatatable';

import buildInstanceClusterPartners from '../../../util/instance/buildInstanceClusterPartners';

export default () => {
  const { compute_stack_id } = useParams();
  const [clusterInstances, setClusterInstances] = useState({ connected: [], unconnected: [], unreachable: [], unregistered: [] });

  const instances = useStoreState(appState, (s) => s.instances.filter((i) => i.compute_stack_id !== compute_stack_id));
  const network = useStoreState(instanceState, (s) => s.network);

  useEffect(() => {
    if (instances && network) setClusterInstances(buildInstanceClusterPartners({ instances, network }));
  }, [instances, network]);

  return (
    <Row id="clustering">
      <Col xl="3" lg="4" md="6" xs="12">
        <InstanceManager
          items={clusterInstances.connected}
          itemType="connected"
        />
        {clusterInstances.unconnected.length ? (
          <InstanceManager
            items={clusterInstances.unconnected}
            itemType="unconnected"
          />
        ) : null}
        {clusterInstances.unreachable.length ? (
          <InstanceManager
            items={clusterInstances.unreachable}
            itemType="unreachable"
          />
        ) : null}
        {clusterInstances.unregistered.length ? (
          <InstanceManager
            items={clusterInstances.unregistered}
            itemType="unregistered"
          />
        ) : null}
      </Col>
      <Col xl="9" lg="8" md="6" xs="12">
        {clusterInstances.connected.length ? (
          <DataTable
            instances={clusterInstances.connected}
          />
        ) : (
          <>
            <span className="text-white floating-card-header">&nbsp;</span>
            <Card className="my-3 py-5">
              <CardBody>
                <div className="text-center">Please connect at least one instance to configure clustering</div>
              </CardBody>
            </Card>
          </>
        )}
      </Col>
    </Row>
  );
};
