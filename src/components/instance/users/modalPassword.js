import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Button, Input, Col, Row } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import alterUser from '../../../api/instance/alterUser';
import instanceState from '../../../state/stores/instanceState';

export default ({ username, closeModal }) => {
  const [formState, setFormState] = useState({});
  const [formData, updateForm] = useState({});
  const alert = useAlert();
  const { auth, url } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
  }));

  const updatePassword = async () => {
    const { password } = formData;

    if (!password) {
      setFormState({ error: 'password is required' });
    } else {
      const response = await alterUser({ auth, url, username, password });

      if (response.message.indexOf('updated') !== -1) {
        alert.success('password updated');
        closeModal({ refresh: true });
      } else {
        setFormState({ error: response.message });
      }
    }
  };

  return (
    <Modal id="new-instance-modal" isOpen toggle={closeModal}>
      <ModalHeader toggle={closeModal}>
        Update Password For &quot;{username}&quot;
      </ModalHeader>
      <ModalBody>
        <Input
          type="text"
          className="mb-2 text-center"
          name="password"
          placeholder="new password"
          value={formData.password || ''}
          onChange={(e) => updateForm({ ...formData, password: e.target.value })}
        />
        <hr />
        <Row>
          <Col sm="6">
            <Button block color="grey" onClick={closeModal}>cancel</Button>
          </Col>
          <Col sm="6">
            <Button block color="danger" onClick={updatePassword}>do it</Button>
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
