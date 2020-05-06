import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Button, Row, Col, CardBody, Card } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import instanceState from '../../../state/instanceState';
import dropUser from '../../../api/instance/dropUser';
import themeState from '../../../state/themeState';

export default ({ username, closeModal }) => {
  const [darkTheme] = themeState(false);
  const [formState, setFormState] = useState({});
  const alert = useAlert();
  const { auth, url } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
  }));

  const deleteUser = async () => {
    const response = await dropUser({ auth, username, url });

    if (response.message.indexOf('successfully') !== -1) {
      alert.success(response.message);
      closeModal({ refresh: true });
    } else {
      setFormState({ error: response.message });
    }
  };

  return (
    <Modal id="new-instance-modal" isOpen toggle={closeModal} className={darkTheme ? 'dark' : ''}>
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
          <Card className="mt-3 error">
            <CardBody>{formState.error}</CardBody>
          </Card>
        )}
      </ModalBody>
    </Modal>
  );
};
