import React, { useState } from 'react';
import { Card, CardBody, Input, Button } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { NavLink } from 'react-router-dom';

import isEmail from '../../methods/util/isEmail';
import resendRegistrationEmail from '../../api/lms/resendRegistrationEmail';
import AuthStateLoader from '../shared/authStateLoader';
import config from '../../../config';

export default () => {
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});

  useAsyncEffect(async () => {
    const { submitted, processing } = formState;
    if (submitted && !processing) {
      const { email } = formData;

      if (!isEmail(email)) {
        setFormState({ error: 'valid email is required' });
      } else {
        setFormState({ processing: true });
        const response = await resendRegistrationEmail({ email });
        if (response.error) {
          setFormState({ error: response.message });
        } else {
          setFormState({ success: response.message });
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
        <AuthStateLoader header="processing request" spinner />
      ) : formState.success ? (
        <AuthStateLoader header="success!" body="check your email. if you still don't see it, send us an email: support@harperdb.io" />
      ) : (
        <>
          <Card className="mb-3">
            <CardBody className="text-center text-white" onKeyDown={(e) => e.keyCode !== 13 || setFormState({ submitted: true })}>
              <Input
                onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
                disabled={formState.submitted}
                className="mb-4 text-center"
                type="text"
                title="email"
                name="email"
                placeholder="email address"
              />
              <Button onClick={() => setFormState({ submitted: true })} disabled={formState.submitted} title="Resend Registration Email" block color="purple">
                Resend Registration Email
              </Button>
            </CardBody>
          </Card>
          {formState.error ? (
            <div className="login-nav-link error">
              {formState.error}
              &nbsp;
            </div>
          ) : (
            <div className="text-center">
              <NavLink to="/" className="login-nav-link">
                Go to Sign In
              </NavLink>
            </div>
          )}
        </>
      )}
    </div>
  );
};
