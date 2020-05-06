import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Button, SelectDropdown, Col, Row, CardBody, Card } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';
import { useAlert } from 'react-alert';

import alterUser from '../../../api/instance/alterUser';
import instanceState from '../../../state/instanceState';
import themeState from '../../../state/themeState';

export default ({ username, role, closeModal }) => {
  const [darkTheme] = themeState(false);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});
  const alert = useAlert();
  const { auth, url, roles } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
    roles: s.roles,
  }));

  const updateRole = async () => {
    const { newRole } = formData;

    if (!newRole) {
      setFormState({ error: 'role is required' });
    } else if (role === newRole) {
      setFormState({ error: 'user already has this role' });
    } else {
      const response = await alterUser({ auth, url, username, role: newRole });

      if (response.message.indexOf('updated') !== -1) {
        alert.success('user role updated');
        closeModal({ refresh: true });
      } else {
        setFormState({ error: response.message });
      }
    }
  };

  useAsyncEffect(() => setFormData({ ...formData, role }), []);

  return (
    <Modal id="new-instance-modal" isOpen toggle={closeModal} className={darkTheme ? 'dark' : ''}>
      <ModalHeader toggle={closeModal}>
        Update Role For &quot;
        {username}
        &quot;
      </ModalHeader>
      <ModalBody>
        <SelectDropdown
          className="react-select-container mb-2"
          classNamePrefix="react-select"
          onChange={({ value }) => setFormData({ ...formData, newRole: value })}
          options={roles && roles.filter((r) => r.id !== role).map((r) => ({ label: r.role, value: r.id }))}
          value={roles && role && roles.find((r) => r.value === role)}
          isSearchable={false}
          isClearable={false}
          isLoading={!roles}
          placeholder="select a role"
          styles={{ placeholder: (styles) => ({ ...styles, textAlign: 'center', width: '100%', color: '#BCBCBC' }) }}
        />
        <hr />
        <Row>
          <Col sm="6">
            <Button block color="grey" onClick={closeModal}>
              cancel
            </Button>
          </Col>
          <Col sm="6">
            <Button block color="danger" onClick={updateRole}>
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
