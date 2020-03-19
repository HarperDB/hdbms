import React, { useState } from 'react';
import { Card, CardBody, Input, Button } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { NavLink } from 'react-router-dom';

import isEmail from '../../util/isEmail';
import resendRegistrationEmail from '../../api/lms/resendRegistrationEmail';
import handleKeydown from '../../util/handleKeydown';

export default () => {
  const [formState, setFormState] = useState({});
  const [formData, updateForm] = useState({});

  useAsyncEffect(async () => {
    const { submitted, processing } = formState;
    if (submitted && !processing) {
      const { email } = formData;

      if (!isEmail(email)) {
        setFormState({ error: 'invalid email supplied' });
      } else if (!email) {
        setFormState({ error: 'email is required' });
      } else {
        setFormState({ ...formState, processing: true });
        const response = await resendRegistrationEmail({ payload: { email } });
        if (response.result === false) {
          setFormState({ error: response.message });
        } else {
          setFormState({ success: response.message });
        }
      }
    }
  }, [formState]);

  useAsyncEffect(() => { if (!formState.submitted) { setFormState({}); } }, [formData]);

  return (
    <div id="login-form">
      <div id="login-logo" title="HarperDB Logo" />
      {formState.processing ? (
        <>
          <Card className="mb-3">
            <CardBody className="text-center text-white">
              Processing Request<br /><br />
              <i className="fa fa-spinner fa-spin text-white" />
            </CardBody>
          </Card>
          <div className="text-small text-white text-center">&nbsp;</div>
        </>
      ) : formState.success ? (
        <>
          <Card className="mb-3">
            <CardBody className="text-center text-white">
              Success!<br /><br />
              Check your email. If you still don&apos;t see it, shoot us an email:<br /><br />
              <a href="mailto:support@harperdb.io">support@harperdb.io</a>
            </CardBody>
          </Card>
          <div className="text-small text-white text-center">&nbsp;</div>
        </>
      ) : (
        <>
          <Card className="mb-3">
            <CardBody className="text-center text-white">
              <Input
                onChange={(e) => updateForm({ ...formData, email: e.target.value })}
                onKeyDown={(e) => handleKeydown(e, setFormState)}
                disabled={formState.submitted}
                className="mb-4 text-center"
                type="text"
                title="email"
                name="email"
                placeholder="email address"
              />
              <Button
                onClick={() => setFormState({ submitted: true })}
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
            <div className="text-small text-white text-center">
              {formState.error}&nbsp;
            </div>
          ) : (
            <div className="text-center text-small">
              <NavLink to="/sign-in" className="login-nav-link">Go to Sign In</NavLink>
            </div>
          )}
        </>
      )}
    </div>
  );
};
