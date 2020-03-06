import React, { useState } from 'react';
import { Card, CardBody, Input, Button, Row, Col } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';

import useLMS from '../../state/stores/lmsAuth';

import defaultAuthFormData from '../../state/defaults/defaultAuthFormData';
import defaultLMSAuth from '../../state/defaults/defaultLMSAuth';

import getUser from '../../api/lms/getUser';
import useApp from '../../state/stores/appData';
import defaultAppData from '../../state/defaults/defaultAppData';
import isEmail from '../../util/isEmail';
import handleKeydown from '../../util/handleKeydown';

export default () => {
  const [lmsAuth, setLMSAuth] = useLMS(defaultLMSAuth);
  const [appData, setAppData] = useApp(defaultAppData);
  const [formState, setFormState] = useState({ submitted: false, error: false });
  const [formData, updateForm] = useState(defaultAuthFormData);
  const history = useHistory();

  useAsyncEffect(async () => {
    const { email, pass } = formData;
    const { submitted } = formState;
    if (submitted) {
      if (!isEmail(email)) {
        setFormState({ error: 'invalid email supplied', submitted: false });
      } else if (!email || !pass) {
        setFormState({ error: 'all fields are required', submitted: false });
      } else {
        const response = await getUser({ auth: { email, pass }, payload: { email } });
        if (response.result === false) {
          setFormState({ error: response.message, submitted: false });
          setLMSAuth(defaultLMSAuth);
        } else {
          setLMSAuth({ email, pass });
          setAppData({ ...appData, user: response });
          if (response.update_password) {
            history.push('/instances'); // history.push('/update-password');
          } else {
            history.push('/instances');
          }
        }
      }
    }
  }, [formState]);

  useAsyncEffect(() => setFormState({ error: false, submitted: false }), [formData]);

  useAsyncEffect(() => {
    const { email, pass } = lmsAuth;
    const { submitted } = formState;
    if (email && pass && !submitted) {
      updateForm({ email, pass });
      setFormState({ submitted: true, error: false });
    }
  }, [lmsAuth]);

  return (
    <div id="login-form" className="sign-in">
      <div id="login-logo" title="HarperDB Logo" />
      {(lmsAuth?.email && lmsAuth?.pass) || formState.submitted ? (
        <Card className="mb-3 mt-2">
          <CardBody>
            <div className="text-white text-center pt-5">
              <b>Signing In</b><br /><br />
              <i className="fa fa-spinner fa-spin text-white" />
            </div>
          </CardBody>
        </Card>
      ) : (
        <>
          <Card className="mb-3 mt-2">
            <CardBody>
              <Input
                onChange={(e) => updateForm({ ...formData, email: e.target.value })}
                onKeyDown={(e) => handleKeydown(e, setFormState)}
                disabled={formState.submitted}
                className="mb-2 text-center"
                type="text"
                title="email"
                placeholder="email address"
              />
              <Input
                onChange={(e) => updateForm({ ...formData, pass: e.target.value })}
                onKeyDown={(e) => handleKeydown(e, setFormState)}
                disabled={formState.submitted}
                className="mb-4 text-center"
                type="password"
                title="password"
                placeholder="password"
              />
              <Button
                onClick={() => setFormState({ submitted: true })}
                title="Sign In My Account"
                block
                color="purple"
                disabled={formState.submitted}
              >
                {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Sign In</span>}
              </Button>
            </CardBody>
          </Card>
          {formState.error ? (
            <div className="text-small text-white text-center">
              {formState.error}&nbsp;
            </div>
          ) : (
            <Row className="text-small">
              <Col xs="6" className="text-nowrap">
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
