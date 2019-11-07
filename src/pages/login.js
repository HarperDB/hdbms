import React, { useState } from 'react';
import { Card, CardBody, Form, Input, Button } from '@nio/ui-kit';
import { useHistory } from 'react-router-dom';
import useAsyncEffect from 'use-async-effect';

export default ({ setAuthorization, authError }) => {
  const history = useHistory();
  const [formValue, setFormValue] = useState({});

  const setFieldValue = (name, value) => {
    formValue[name] = value;
    setFormValue(formValue);
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setAuthorization(btoa(`${formValue.HDB_USER}:${formValue.HDB_PASS}`));
  };

  let redirectTimeout = false;
  useAsyncEffect(() => redirectTimeout = setTimeout(() => history.push('/'), 100), () => clearTimeout(redirectTimeout), []);

  return (
    <div id="login-form">
      <div id="login-logo" />
      <Card className="mb-3 mt-2 dark">
        <CardBody onSubmit={submitLogin}>
          <Form>
            <Input
              onChange={(e) => setFieldValue('HDB_USER', e.target.value)}
              className="mb-2 text-center"
              type="text"
              name="HDB_USER"
              placeholder="username"
            />
            <Input
              onChange={(e) => setFieldValue('HDB_PASS', e.target.value)}
              className="mb-4 text-center"
              type="password"
              name="HDB_PASS"
              placeholder="password"
            />
            <Button block color="success">Log Into HarperDB</Button>
          </Form>
        </CardBody>
      </Card>
      <div className="text-white text-center text-smaller">{authError}&nbsp;</div>
    </div>
  );
};
