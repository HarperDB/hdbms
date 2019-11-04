import React, { useState, useContext } from 'react';
import { Card, CardBody, Form, Input, Button } from '@nio/ui-kit';
import { withRouter } from 'react-router-dom';

import { HarperDBContext } from '../providers/harperdb';

export default withRouter((props) => {
  const { error, setConnection } = useContext(HarperDBContext);
  const [formValue, setFormValue] = useState({});

  const submitLogin = (e) => {
    e.preventDefault();
    setConnection(formValue);
    props.history.push('/browse');
  };

  const setFieldValue = (name, value) => {
    formValue[name] = value;
    setFormValue(formValue);
  };

  return (
    <div id="login-form">
      <div id="login-logo" />
      <Card className="mb-3 mt-2">
        <CardBody onSubmit={submitLogin}>
          <Form>
            <Input
              onChange={(e) => setFieldValue('HDB_USER', e.target.value)}
              className="mb-2"
              type="text"
              name="HDB_USER"
              placeholder="username"
            />
            <Input
              onChange={(e) => setFieldValue('HDB_PASS', e.target.value)}
              className="mb-4"
              type="password"
              name="HDB_PASS"
              placeholder="password"
            />
            <Button block color="success">Log Into HarperDB</Button>
          </Form>
        </CardBody>
      </Card>
      <span className="text-white text-center">{error}</span>
    </div>
  );
});
