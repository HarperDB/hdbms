import React, { useState } from 'react';
import { Card, CardBody, Input, Button, Col, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { NavLink } from 'react-router-dom';

import isEmail from '../../util/isEmail';
import resetPassword from '../../api/lms/resetPassword';
import handleKeydown from '../../util/handleKeydown';

export default () => {
  const [formState, setFormState] = useState({ submitted: false, error: false, success: false });
  const [formData, updateForm] = useState({ email: false });

  useAsyncEffect(async () => {
    const { email } = formData;
    const { submitted } = formState;
    if (submitted) {
      if (!isEmail(email)) {
        setFormState({ error: 'invalid email supplied', submitted: false });
      } else if (!email) {
        setFormState({ error: 'email is required', submitted: false });
      } else {
        const response = await resetPassword({ payload: { email } });
        if (response.result === false) {
          setFormState({ error: response.message, submitted: false, success: false });
        } else {
          setFormState({ success: response.message, error: false, submitted: false });
        }
      }
    }
  }, [formState]);

  useAsyncEffect(() => setFormState({ error: false, submitted: false }), [formData]);

  return (
    <div id="login-form" className="forgot-password">
      <div id="login-logo" title="HarperDB Logo" />
      <Card className="mb-3 mt-2">
        <CardBody>
          {formState.success ? (
            <div className="text-white text-center pt-4">
              {formState.success}
            </div>
          ) : (
            <>
              <Input
                onChange={(e) => updateForm({ ...formData, email: e.target.value })}
                onKeyDown={(e) => handleKeydown(e, setFormState)}
                disabled={formState.submitted}
                className="mb-4 text-center"
                type="text"
                title="email"
                placeholder="email address"
              />
              <Button
                onClick={() => setFormState({ submitted: true })}
                disabled={formState.submitted}
                title="Send Password Reset Email"
                block
                color="purple"
              >
                {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Send Password Reset Email</span>}
              </Button>
            </>
          )}
        </CardBody>
      </Card>
      {formState.error ? (
        <div className="text-small text-white text-center">
          {formState.error}&nbsp;
        </div>
      ) : (
        <Row className="text-small">
          <Col xs="6" className="text-nowrap">
            <NavLink to="/sign-in" className="login-nav-link">Back to Sign In</NavLink>
          </Col>
          <Col xs="6" className="text-nowrap text-right">
            <NavLink to="/sign-up" className="login-nav-link">Sign Up for Free</NavLink>
          </Col>
        </Row>
      )}
    </div>
  );
};
