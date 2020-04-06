import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, ModalHeader, ModalBody, Modal, Button } from '@nio/ui-kit';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';

import appState from '../../../state/stores/appState';
import instanceState from '../../../state/stores/instanceState';

import InstanceManager from './manageInstances';
import DataTable from './manageDatatable';

import buildInstanceClusterPartners from '../../../util/instance/buildInstanceClusterPartners';
import config from '../../../../config';

export default () => {
  const { compute_stack_id } = useParams();
  const [clusterInstances, setClusterInstances] = useState({
    connected: [],
    unconnected: [],
    unregistered: [],
  });
  const [showModal, setShowModal] = useState(false);

  const instances = useStoreState(appState, (s) => s.instances.filter((i) => i.compute_stack_id !== compute_stack_id));
  const { network, instance_name } = useStoreState(instanceState, (s) => ({
    network: s.network,
    instance_name: s.instance_name,
  }));

  useEffect(() => {
    if (instances && network)
      setClusterInstances(
        buildInstanceClusterPartners({
          instances,
          network,
        })
      );
  }, [instances, network]);

  useInterval(() => {
    instanceState.update((s) => {
      s.lastUpdate = Date.now();
    });
  }, config.instance_refresh_rate);

  return (
    <>
      <Row id="clustering">
        <Col xl="3" lg="4" md="6" xs="12">
          <InstanceManager items={clusterInstances.connected} setShowModal={setShowModal} itemType="connected" />
          {clusterInstances.unconnected.length ? <InstanceManager items={clusterInstances.unconnected} itemType="unconnected" /> : null}
          {clusterInstances.unregistered.length ? <InstanceManager items={clusterInstances.unregistered} itemType="unregistered" /> : null}
        </Col>
        <Col xl="9" lg="8" md="6" xs="12">
          {clusterInstances.connected.length ? (
            <DataTable instances={clusterInstances.connected.filter((i) => i.connection.state === 'open')} />
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
      <Modal id="cluster-state-modal" isOpen={!!showModal} toggle={() => setShowModal(false)}>
        <ModalHeader toggle={() => setShowModal(false)}>Instance Cluster Error</ModalHeader>
        <ModalBody>
          <Card>
            <CardBody>
              <b>{instance_name}</b> is unable to open a connection to <b>{showModal}</b>.
              <hr />
              <ul>
                <li>Clustered instances must be able to reach each other. This may require allowing access through a firewall.</li>
                <li>Both instances must be running. In the event of a restart, instances will automatically attempt to reconnect.</li>
                <li>
                  Clustered instances must have the same cluster user <b>name</b> and <b>password</b>. You can edit an instance&apos;s cluster user credentials in the <b>config</b>{' '}
                  section.
                </li>
              </ul>
              <hr />
              If none of these help fix the issue, you can disconnect <b>{showModal}</b> from <b>{instance_name}</b> by clicking the purple disconnect button with the minus sign.
              <hr />
              <Button block onClick={() => setShowModal(false)} color="danger">
                OK
              </Button>
            </CardBody>
          </Card>
        </ModalBody>
      </Modal>
    </>
  );
};
