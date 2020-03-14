import React, { useState } from 'react';
import { Card, CardBody, Input, Button, Row, Col } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';

import useLMS from '../../state/stores/lmsAuth';
import defaultLMSAuth from '../../state/defaults/defaultLMSAuth';

import getUser from '../../api/lms/getUser';
import isEmail from '../../util/isEmail';
import handleKeydown from '../../util/handleKeydown';

export default () => {
  const [lmsAuth, setLMSAuth] = useLMS(defaultLMSAuth);
  const [formState, setFormState] = useState({ submitted: false, error: false, processing: false, success: false });
  const [formData, updateForm] = useState({ user: false, pass: false });
  const history = useHistory();

  useAsyncEffect(async () => {
    const { submitted, processing } = formState;
    if (submitted && !processing) {
      const { email, pass } = formData;

      if (!isEmail(email)) {
        setFormState({ error: 'invalid email supplied', submitted: false });
      } else if (!email || !pass) {
        setFormState({ error: 'all fields are required', submitted: false });
      } else {
        setFormState({ ...formState, processing: true });
        const response = await getUser({ auth: { email, pass }, payload: { email } });
        if (response.result === false) {
          setFormState({ error: 'Invalid Credentials', submitted: false });
          setLMSAuth(defaultLMSAuth);
        } else {
          setLMSAuth({ ...response, email, pass });
          setTimeout(() => history.push(response.update_password ? '/update-password' : '/instances'), 100);
        }
      }
    }
  }, [formState]);

  useAsyncEffect(() => { if (!formState.submitted) { setFormState({ error: false, submitted: false, processing: false, success: false }); } }, [formData]);

  useAsyncEffect(() => {
    const { email, pass } = lmsAuth;
    const { submitted } = formState;
    if (email && pass && !submitted) {
      updateForm({ email, pass });
      setFormState({ submitted: true, error: false, processing: false, success: false });
    }
  }, [lmsAuth]);

  return (
    <div id="login-form">
      <div id="login-logo" title="HarperDB Logo" />
      {(lmsAuth?.email && lmsAuth?.pass) || formState.processing ? (
        <>
          <Card className="mb-3">
            <CardBody className="text-white text-center">
              Signing In<br /><br />
              <i className="fa fa-spinner fa-spin text-white" />
            </CardBody>
          </Card>
          <div className="text-small text-white text-center">&nbsp;</div>
        </>
      ) : (
        <>
          <Card className="mb-3">
            <CardBody>
              <Input
                onChange={(e) => updateForm({ ...formData, email: e.target.value })}
                onKeyDown={(e) => handleKeydown(e, setFormState)}
                disabled={formState.submitted}
                className="mb-2 text-center"
                type="text"
                title="email"
                autoComplete="false"
                placeholder="email address"
              />
              <Input
                onChange={(e) => updateForm({ ...formData, pass: e.target.value })}
                onKeyDown={(e) => handleKeydown(e, setFormState)}
                disabled={formState.submitted}
                className="mb-4 text-center"
                type="password"
                title="password"
                autoComplete="false"
                placeholder="password"
              />
              <Button
                onClick={() => setFormState({ submitted: true })}
                title="Sign In My Account"
                block
                color="purple"
                disabled={formState.submitted}
              >
                Sign In
              </Button>
            </CardBody>
          </Card>
          {formState.error ? (
            <div className="text-small text-white text-center">
              {formState.error}
            </div>
          ) : (
            <Row className="text-small">
              <Col xs="6" className="text-nowrap text-center">
                <NavLink to="/forgot-password" className="login-nav-link">Forgot Password</NavLink>
              </Col>
              <Col xs="6" className="text-nowrap text-right">
                <NavLink to="/sign-up" className="login-nav-link">Sign Up for Free</NavLink>
              </Col>
            </Row>
          )}
        </>
      )}
    </div>
  );
};
