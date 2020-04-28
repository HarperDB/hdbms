import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Button, Input, Col, Row, CardBody, Card } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import alterUser from '../../../api/instance/alterUser';
import instanceState from '../../../state/instanceState';
import useDarkTheme from '../../../state/darkTheme';

export default ({ username, closeModal, clusterUser }) => {
  const [darkTheme] = useDarkTheme(false);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});
  const alert = useAlert();
  const { auth, url } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
  }));

  const updatePassword = async () => {
    const { password } = formData;

    if (!password) {
      setFormState({
        error: 'password is required',
      });
    } else {
      const response = await alterUser({
        auth,
        url,
        username,
        password,
      });

      if (response.message.indexOf('updated') !== -1) {
        alert.success('password updated');
        closeModal({ refresh: true });
      } else {
        setFormState({
          error: response.message,
        });
      }
    }
  };

  return (
    <Modal id="new-instance-modal" isOpen toggle={closeModal} className={darkTheme ? 'dark' : ''}>
      <ModalHeader toggle={closeModal}>
        Update Password For &quot;
        {username}
        &quot;
      </ModalHeader>
      <ModalBody>
        <Input
          type="text"
          className="mb-2 text-center"
          name="password"
          placeholder="enter new password"
          value={formData.password || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value,
            })
          }
        />
        {clusterUser && (
          <Card>
            <CardBody className="text-danger">
              You must <b>restart</b> the instance for the cluster user reconnect with a new password. You may do this in the <b>Config</b> section.
            </CardBody>
          </Card>
        )}
        <hr />
        <Row>
          <Col sm="6">
            <Button block color="grey" onClick={closeModal}>
              cancel
            </Button>
          </Col>
          <Col sm="6">
            <Button block color="danger" onClick={updatePassword}>
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
