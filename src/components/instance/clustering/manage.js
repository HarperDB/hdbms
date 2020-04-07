import React, { useState } from 'react';
import { Row, Col, Card, CardBody, ModalHeader, ModalBody, Modal, Button } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';
import { useParams } from 'react-router-dom';

import instanceState from '../../../state/stores/instanceState';

import InstanceManager from './manageInstances';
import DataTable from './manageDatatable';

export default () => {
  const { compute_stack_id } = useParams();
  const [showModal, setShowModal] = useState(false);

  const { instance_name, clustering } = useStoreState(
    instanceState,
    (s) => ({
      instance_name: s.instance_name,
      clustering: s.clustering,
    }),
    [compute_stack_id]
  );

  useInterval(() => {
    if (clustering?.connected?.find((i) => i.connection.state === 'connecting')) {
      instanceState.update((s) => {
        s.lastUpdate = Date.now();
      });
    }
  }, 1000);

  return (
    <>
      <Row id="clustering">
        <Col xl="3" lg="4" md="6" xs="12">
          <InstanceManager items={clustering?.connected || []} setShowModal={setShowModal} itemType="connected" />
          {clustering?.unconnected?.length ? <InstanceManager items={clustering.unconnected} itemType="unconnected" /> : null}
          {clustering?.unregistered?.length ? <InstanceManager items={clustering.unregistered} itemType="unregistered" /> : null}
        </Col>
        <Col xl="9" lg="8" md="6" xs="12">
          {clustering?.connected?.length ? (
            <DataTable instances={clustering.connected.filter((i) => i.connection.state !== 'closed')} />
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
