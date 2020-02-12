import React, { useState } from 'react';
import { Row, Col, Button, Input } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useAlert } from 'react-alert';

import defaultFormData from '../../util/defaultClusterFormData';

export default ({ port, setPort }) => {
  const alert = useAlert();
  const [portFormData, updatePortForm] = useState({ ...defaultFormData });

  useAsyncEffect(async () => {
    const { submitted, newPort } = portFormData;
    if (submitted) {
      if (!newPort) {
        updatePortForm({ ...portFormData, error: true, submitted: false });
        alert.error('All fields are required.');
      } else {
        setPort(newPort);
        updatePortForm({ ...defaultFormData });
      }
    }
  }, [portFormData]);

  return port ? (
    <Row className="config-row">
      <Col xs="12" md="3" className="text">Cluster Port</Col>
      <Col xs="12" md="6" className="text">{port}</Col>
      <Col xs="12" md="3" className="text text-right">
        <i className="fa fa-check-circle fa-lg text-success" />
      </Col>
    </Row>
  ) : (
    <Row className={`config-row cluster-form ${portFormData.error ? 'error' : ''}`}>
      <Col xs="12" md="3" className="text">Choose a Cluster Port</Col>
      <Col xs="12" md="3">
        <Input
          onChange={(e) => updatePortForm({ ...portFormData, newPort: e.target.value, error: false })}
          className="mb-1"
          type="number"
          title="port"
          placeholder="cluster port"
        />
      </Col>
      <Col xs="12" md="3" />
      <Col xs="12" md="3">
        <Button color="success" block onClick={() => updatePortForm({ ...portFormData, submitted: true, error: false })}>Set Cluster Port</Button>
      </Col>
    </Row>
  );
};
