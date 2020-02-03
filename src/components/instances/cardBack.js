import React, { useState } from 'react';
import { Button, Card, CardBody, Input, Row, Col } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useAlert } from 'react-alert';
import queryInstance from '../../util/queryInstance';
import defaultFormData from '../../util/defaultFormData';

export default ({ id, url, port, is_ssl, setAuth, flipCard }) => {
  const alert = useAlert();
  const [formData, updateForm] = useState(defaultFormData);

  useAsyncEffect(async () => {
    if (formData.submitted) {
      const instance = await queryInstance({ operation: 'describe_all' }, { ...formData, url, port, is_ssl });
      if (instance.error) {
        alert.error(instance.error);
        updateForm({ ...formData, error: instance.error, submitted: false });
      } else {
        updateForm(defaultFormData);
        setAuth({ id, user: formData.user, pass: formData.pass });
        flipCard();
      }
    }
  }, [formData]);

  return (
    <Card className={`instance ${formData.error ? 'error' : ''}`}>
      <CardBody>
        <Input
          onChange={(e) => updateForm({ ...formData, user: e.target.value, error: false })}
          className="text-center mb-1"
          type="text"
          title="username"
          placeholder="user"
        />
        <Input
          onChange={(e) => updateForm({ ...formData, pass: e.target.value, error: false })}
          className="text-center mb-1"
          type="password"
          title="password"
          placeholder="pass"
        />
        <Row noGutters>
          <Col xs="6" className="pr-1">
            <Button
              onClick={() => { updateForm(defaultFormData); flipCard(); }}
              title="Cancel"
              block
              color="grey"
            >
              Cancel
            </Button>
          </Col>
          <Col xs="6" className="pl-1">
            <Button
              onClick={() => updateForm({ ...formData, submitted: true, error: false })}
              title="Log Into Instance"
              block
              color="purple"
            >
              Log In
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};
