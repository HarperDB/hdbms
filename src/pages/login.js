import React, { useState, useContext, useEffect } from 'react';
import { Card, CardBody, Form, Input, Button } from '@nio/ui-kit';
import { useLocation } from 'react-router-dom';

import { HarperDBContext } from '../providers/harperdb';

export default () => {
  const { authError, setAuthorization } = useContext(HarperDBContext);
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState(false);
  const [formValue, setFormValue] = useState({});

  const setFieldValue = (name, value) => {
    formValue[name] = value;
    setFormValue(formValue);
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setAuthorization(btoa(`${formValue.HDB_USER}:${formValue.HDB_PASS}`));
  };

  useEffect(() => {
    if (location && location.state && location.state.error) {
      setErrorMessage(location.state.error);
    } else if (authError) {
      setErrorMessage(authError);
    }
  });

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
      <div className="text-white text-center text-smaller">{errorMessage}&nbsp;</div>
    </div>
  );
};
