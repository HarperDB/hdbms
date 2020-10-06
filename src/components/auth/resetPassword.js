import React, { useState } from 'react';
import { Card, CardBody, Input, Button, Col, Row } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { NavLink } from 'react-router-dom';

import isEmail from '../../functions/util/isEmail';
import resetPassword from '../../functions/api/lms/resetPassword';
import Loader from '../shared/loader';
import config from '../../config';

const ResetPassword = () => {
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});

  useAsyncEffect(async () => {
    const { submitted, processing } = formState;
    if (submitted && !processing) {
      const { email } = formData;

      if (!isEmail(email)) {
        setFormState({ error: 'valid email is required' });
        setTimeout(() => setFormState({}), 2000);
      } else {
        setFormState({ processing: true });
        const response = await resetPassword({ email });

        if (response.error && response.message !== 'User does not exist') {
          setFormState({ error: response.message });
          setTimeout(() => setFormState({}), 2000);
        } else {
          setFormState({ success: true });
        }
      }
    }
  }, [formState]);

  useAsyncEffect(() => {
    if (!formState.submitted) setFormState({});
  }, [formData]);

  return (
    <div id="login-form">
      <div id="login-logo" title="HarperDB Logo" />
      <div className="version">Studio v{config.studio_version}</div>
      {formState.processing ? (
        <Loader header="resetting password" spinner relative />
      ) : formState.success ? (
        <Loader header="success!" body="check the provided email for a password reset link." links={[{ to: '/', text: 'Go to Sign In', className: 'text-center' }]} relative />
      ) : (
        <>
          <Card className="mb-3">
            <CardBody className="text-center text-white" onKeyDown={(e) => e.keyCode !== 13 || setFormState({ submitted: true })}>
              <Input
                id="email"
                onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
                disabled={formState.submitted}
                className="mb-4 text-center"
                type="text"
                title="email"
                name="email"
                placeholder="email address"
              />
              <Button
                id="sendPasswordResetEmail"
                onClick={() => setFormState({ submitted: true })}
                disabled={formState.submitted}
                title="Send Password Reset Email"
                block
                color="purple"
              >
                Send Password Reset Email
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

export default ResetPassword;
