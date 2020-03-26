import React, { useState } from 'react';
import { Row, Col, Button, Input } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

export default ({ port, setPort }) => {
  const [formState, setFormState] = useState({});
  const [formData, updateForm] = useState({});

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const { newPort } = formData;
      if (!newPort) {
        setFormState({ error: 'All fields are required.' });
      } else {
        setPort(newPort);
      }
    }
  }, [formState]);

  return port ? (
    <Row className="config-row">
      <Col xs="12" md="3" className="text">Cluster Port</Col>
      <Col xs="12" md="6" className="text">{port}</Col>
      <Col xs="12" md="3" className="text text-right">
        <i className="fa fa-check-circle fa-lg text-success" />
      </Col>
    </Row>
  ) : (
    <Row className={`config-row cluster-form ${formState.error ? 'error' : ''}`}>
      <Col xs="12" md="3" className="text">Cluster Port</Col>
      <Col xs="12" md="3">
        <Input
          onChange={(e) => updateForm({ ...formData, newPort: e.target.value })}
          className="mb-1"
          type="number"
          title="port"
          placeholder="cluster port"
        />
      </Col>
      <Col xs="12" md="3" />
      <Col xs="12" md="3">
        <Button color="success" block onClick={() => setFormState({ submitted: true })}>Set Cluster Port</Button>
      </Col>
    </Row>
  );
};
