import React from 'react';
import { Card, CardBody, ModalHeader, ModalBody, Modal, Button } from 'reactstrap';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';

import instanceState from '../../../../functions/state/instanceState';

const ManageErrorModal = ({ showModal, setShowModal }) => {
  const { compute_stack_id } = useParams();
  const instance_name = useStoreState(instanceState, (s) => s.instance_name, [compute_stack_id]);

  return (
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
  );
};

export default ManageErrorModal;
