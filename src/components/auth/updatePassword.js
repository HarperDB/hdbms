import React, { useEffect, useState } from 'react';
import { Card, CardBody, Input, Button, Col, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { NavLink } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import appState from '../../state/appState';

import updatePassword from '../../api/lms/updatePassword';
import config from '../../config';

const UpdatePassword = () => {
  const auth = useStoreState(appState, (s) => s.auth);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});

  useAsyncEffect(async () => {
    const { submitted, processing } = formState;
    if (submitted && !processing) {
      const { password, password2 } = formData;

      if (!password || !password2) {
        setFormState({ error: 'all fields are required' });
      } else if (password !== password2) {
        setFormState({ error: 'passwords must match' });
      } else {
        setFormState({ processing: true });
        updatePassword({ auth, ...auth, password });
      }
    }
  }, [formState]);

  useEffect(() => {
    if (auth?.passwordError) {
      setFormState({ error: auth.message });
      setTimeout(() => setFormState({}), 3000);
    }
  }, [auth?.passwordError]);

  useAsyncEffect(() => !formState.submitted && setFormState({}), [formData]);

  return (
    <div id="login-form">
      <div id="login-logo" title="HarperDB Logo" />
      <div className="version">Studio v{config.studio_version}</div>
      {formState.processing ? (
        <>
          <Card className="mb-3">
            <CardBody className="text-white text-center">
              <div className="mb-3">updating your password</div>
              <i className="fa fa-spinner fa-spin text-white" />
            </CardBody>
          </Card>
          <div className="login-nav-link">&nbsp;</div>
        </>
      ) : (
        <>
          <Card className="mb-3">
            <CardBody onKeyDown={(e) => e.keyCode !== 13 || setFormState({ submitted: true })}>
              <Input
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={formState.submitted}
                className="mb-2 text-center"
                type="password"
                title="password"
                placeholder="new password"
              />
              <Input
                onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
                disabled={formState.submitted}
                className="mb-4 text-center"
                type="password"
                title="verify password"
                placeholder="verify password"
              />
              <Button onClick={() => setFormState({ submitted: true })} disabled={formState.submitted} title="Update My Password" block color="purple">
                Update My Password
              </Button>
            </CardBody>
          </Card>
          {formState.error ? (
            <div className="login-nav-link error">
              {formState.error}
              &nbsp;
            </div>
          ) : (
            <Row>
              <Col xs="6">
                <NavLink to="/" className="login-nav-link">
                  Back to Sign In
                </NavLink>
              </Col>
              <Col xs="6" className="text-right">
                <NavLink to="/sign-up" className="login-nav-link">
                  Sign Up for Free
                </NavLink>
              </Col>
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default UpdatePassword;
