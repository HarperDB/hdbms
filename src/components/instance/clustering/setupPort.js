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
        setFormState({
          error: 'All fields are required.',
        });
      } else {
        setPort(newPort);
      }
    }
  }, [formState]);

  return port ? (
    <Row>
      <Col xs="12">
        <hr />
      </Col>
      <Col xs="10" className="text">
        Cluster Port {port}
      </Col>
      <Col xs="2" className="text-right">
        <i className="fa fa-check-circle fa-lg text-success" />
      </Col>
    </Row>
  ) : (
    <>
      <hr />
      <div className="mb-3">Cluster Port</div>
      <Input
        onChange={(e) =>
          updateForm({
            ...formData,
            newPort: e.target.value,
          })
        }
        className="mb-3"
        type="number"
        title="port"
        placeholder="cluster port"
      />
      <Button
        color="success"
        block
        onClick={() =>
          setFormState({
            submitted: true,
          })
        }
      >
        Set Cluster Port
      </Button>
    </>
  );
};
