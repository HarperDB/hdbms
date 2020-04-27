import React, { useState } from 'react';
import { Card, CardBody, Input, Button } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { NavLink } from 'react-router-dom';

import isEmail from '../../methods/util/isEmail';
import resendRegistrationEmail from '../../api/lms/resendRegistrationEmail';
import handleKeydown from '../../methods/util/handleKeydown';

export default () => {
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});

  useAsyncEffect(async () => {
    const { submitted, processing } = formState;
    if (submitted && !processing) {
      const { email } = formData;

      if (!isEmail(email)) {
        setFormState({
          error: 'invalid email supplied',
        });
        setTimeout(() => setFormData({}), 1000);
      } else if (!email) {
        setFormState({
          error: 'email is required',
        });
        setTimeout(() => setFormData({}), 1000);
      } else {
        setFormState({
          ...formState,
          processing: true,
        });
        const response = await resendRegistrationEmail({ email });
        if (response.error) {
          setFormState({
            error: response.message,
          });
          setTimeout(() => {
            setFormState({});
            setFormData({});
          }, 1000);
        } else {
          setFormState({
            success: response.message,
          });
        }
      }
    }
  }, [formState]);

  useAsyncEffect(() => {
    if (!formState.submitted) {
      setFormState({});
    }
  }, [formData]);

  return (
    <div id="login-form">
      <div id="login-logo" title="HarperDB Logo" />
      {formState.processing ? (
        <>
          <Card className="mb-3">
            <CardBody className="text-white text-center">
              <div className="mb-3">processing request</div>
              <i className="fa fa-spinner fa-spin text-white" />
            </CardBody>
          </Card>
          <div className="login-nav-link">&nbsp;</div>
        </>
      ) : formState.success ? (
        <>
          <Card className="mb-3">
            <CardBody className="text-white text-center">
              <div className="mb-3">success!</div>
              check your email. if you still don&apos;t see it, shoot us an email:
              <br />
              <br />
              <a href="mailto:support@harperdb.io">support@harperdb.io</a>
            </CardBody>
          </Card>
          <div className="login-nav-link">&nbsp;</div>
        </>
      ) : (
        <>
          <Card className="mb-3">
            <CardBody className="text-center text-white">
              <Input
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                onKeyDown={(e) => handleKeydown(e, setFormState)}
                disabled={formState.submitted}
                className="mb-4 text-center"
                type="text"
                title="email"
                name="email"
                placeholder="email address"
              />
              <Button
                onClick={() =>
                  setFormState({
                    submitted: true,
                  })
                }
                disabled={formState.submitted}
                title="Resend Registration Email"
                block
                color="purple"
              >
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
              <NavLink to="/sign-in" className="login-nav-link">
                Go to Sign In
              </NavLink>
            </div>
          )}
        </>
      )}
    </div>
  );
};
