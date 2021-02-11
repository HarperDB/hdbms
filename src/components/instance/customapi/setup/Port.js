import React, { useState } from 'react';
import { Row, Col, Button, Input, Card, CardBody } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';

import isNumeric from '../../../../functions/util/isNumeric';
import buildCustomAPI from '../../../../functions/instance/buildCustomAPI';
import createCustomAPIPortValue from '../../../../functions/instance/createCustomAPIPortValue';
import instanceState from '../../../../functions/state/instanceState';

const Port = () => {
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const custom_api_port = useStoreState(instanceState, (s) => s.custom_api?.custom_api_port);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({ port: custom_api_port || 9926 });

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const { port } = formData;
      if (!port) {
        setFormState({ error: 'All fields are required' });
      } else if (!isNumeric(port)) {
        setFormState({ error: 'port must be a valid number' });
      } else {
        const response = await createCustomAPIPortValue({ auth, url, port });
        if (!response.error) {
          buildCustomAPI({ auth, url });
        } else {
          setFormState({ error: response.message });
        }
      }
    }
  }, [formState]);

  useAsyncEffect(() => {
    if (!formState.submitted) {
      setFormState({});
    }
  }, [formData]);

  return custom_api_port ? (
    <Row>
      <Col xs="12">
        <hr className="my-3" />
      </Col>
      <Col xs="10">Custom API Port</Col>
      <Col xs="2" className="text-right">
        <i className="fa fa-check-circle fa-lg text-success" />
      </Col>
    </Row>
  ) : (
    <>
      <hr className="my-3" />
      <div className="text-nowrap mb-3">Set Custom API Port</div>
      <Input
        id="custom_api_port"
        onChange={(e) => setFormData({ ...formData, port: e.target.value })}
        className={`mb-3 ${formState.error && !formData.port ? 'error' : ''}`}
        type="number"
        title="custom api port"
        placeholder="9926"
        value={formData.port}
      />
      <Button color="success" block onClick={() => setFormState({ submitted: true })}>
        Set Custom API Port
      </Button>
      {formState.error && (
        <Card className="mt-3 error">
          <CardBody>{formState.error}</CardBody>
        </Card>
      )}
    </>
  );
};

export default Port;
