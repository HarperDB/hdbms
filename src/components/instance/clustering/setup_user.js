import React, { useState } from 'react';
import { Row, Col, Button, Input } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useAlert } from 'react-alert';

import createClusterUser from '../../../api/instance/createClusterUser';

export default ({ clusterUser, clusterRole, auth, refreshInstance, url }) => {
  const alert = useAlert();
  const [formState, setFormState] = useState({ submitted: false, error: false });
  const [formData, updateForm] = useState({ username: false, password: false });

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const { username, password } = formData;
      if (!username || !password) {
        updateForm({ ...formData, error: true, submitted: false });
        alert.error('All fields are required.');
      } else {
        const result = await createClusterUser({ username, password, role: clusterRole, auth, refreshInstance, url });
        if (result.message.indexOf('successfully') === -1) {
          alert.error(result.message);
        }
      }
    }
  }, [formState]);

  return clusterUser ? (
    <Row className="config-row">
      <Col xs="12" md="3" className="text">Cluster User</Col>
      <Col xs="12" md="6" className="text">{clusterUser}</Col>
      <Col xs="12" md="3" className="text text-right">
        <i className="fa fa-check-circle fa-lg text-success" />
      </Col>
    </Row>
  ) : (
    <Row className={`config-row cluster-form ${formState.error ? 'error' : ''}`}>
      <Col xs="12" md="3" className="text text-nowrap">Create a Cluster User</Col>
      <Col xs="12" md="3">
        <Input
          onChange={(e) => updateForm({ ...formData, username: e.target.value, error: false })}
          className="mb-1"
          type="text"
          title="username"
          placeholder="username"
        />
      </Col>
      <Col xs="12" md="3">
        <Input
          onChange={(e) => updateForm({ ...formData, password: e.target.value, error: false })}
          className="mb-1"
          type="password"
          title="password"
          placeholder="password"
        />
      </Col>
      <Col xs="12" md="3">
        <Button color="success" block onClick={() => setFormState({ submitted: true, error: false })}>Create Cluster User</Button>
      </Col>
    </Row>
  );
};
