import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Button, Row, Col } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import instanceState from '../../../state/stores/instanceState';
import dropUser from '../../../api/instance/dropUser';

export default ({ username, closeModal }) => {
  const [formState, setFormState] = useState({});
  const alert = useAlert();
  const { auth, url } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
  }));

  const deleteUser = async () => {
    const response = await dropUser({
      auth,
      username,
      url,
    });

    if (response.message.indexOf('successfully') !== -1) {
      alert.success(response.message);
      closeModal({ refresh: true });
    } else {
      setFormState({
        error: response.message,
      });
    }
  };

  return (
    <Modal id="new-instance-modal" isOpen toggle={closeModal}>
      <ModalHeader toggle={closeModal}>
        Delete User &quot;
        {username}
        &quot;
      </ModalHeader>
      <ModalBody>
        <div className="text-center">
          Are you sure you want to delete {username}
          ?
          <br />
          <br />
          This action cannot be undone.
        </div>
        <hr />
        <Row>
          <Col sm="6">
            <Button block color="grey" onClick={closeModal}>
              cancel
            </Button>
          </Col>
          <Col sm="6">
            <Button block color="danger" onClick={deleteUser}>
              do it
            </Button>
          </Col>
        </Row>
        {formState.error && (
          <div className="mt-3 text-danger text-small text-center">
            <hr />
            {formState.error}
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};
