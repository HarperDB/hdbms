import React, { useState } from 'react';
import { Card, CardBody, Input, Button, Col, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router';

import useLMS from '../../state/stores/lmsAuth';
import defaultLMSAuth from '../../state/defaults/defaultLMSAuth';

import updatePassword from '../../api/lms/updatePassword';
import handleKeydown from '../../util/handleKeydown';

export default () => {
  const [lmsAuth, setLMSAuth] = useLMS(defaultLMSAuth);
  const [formState, setFormState] = useState({ submitted: false, error: false, processing: false, success: false });
  const [formData, updateForm] = useState({ password: false, password2: false });
  const history = useHistory();

  useAsyncEffect(async () => {
    const { submitted, processing } = formState;
    if (submitted && !processing) {
      const { password, password2 } = formData;

      if (!password || !password2) {
        setFormState({ error: 'all fields are required', submitted: false });
      } else if (password !== password2) {
        setFormState({ error: 'passwords must match', submitted: false });
      } else {
        setFormState({ ...formState, processing: true });
        const response = await updatePassword({ auth: lmsAuth, payload: { email: lmsAuth.email, user_id: lmsAuth.user_id, password } });
        if (response.result === false) {
          setFormState({ error: response.message, submitted: false, processing: false, success: false });
        } else {
          setFormState({ error: false, submitted: false, processing: false, success: false });
          setLMSAuth({ ...lmsAuth, pass: password });
          history.push('/sign-in');
        }
      }
    }
  }, [formState]);

  useAsyncEffect(() => { if (!formState.submitted) { setFormState({ error: false, submitted: false, processing: false, success: false }); } }, [formData]);

  return (
    <div id="login-form">
      <div id="login-logo" title="HarperDB Logo" />
      {formState.processing ? (
        <>
          <Card className="mb-3">
            <CardBody className="text-white text-center">
              Updating Your Password<br /><br />
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
                onChange={(e) => updateForm({ ...formData, password: e.target.value })}
                onKeyDown={(e) => handleKeydown(e, setFormState)}
                disabled={formState.submitted}
                className="mb-2 text-center"
                type="password"
                title="password"
                placeholder="new password"
              />
              <Input
                onChange={(e) => updateForm({ ...formData, password2: e.target.value, error: false })}
                onKeyDown={(e) => handleKeydown(e, setFormState)}
                disabled={formState.submitted}
                className="mb-4 text-center"
                type="password"
                title="verify password"
                placeholder="verify password"
              />
              <Button
                onClick={() => setFormState({ submitted: true })}
                disabled={formState.submitted}
                title="Update My Password"
                block
                color="purple"
              >
                Update My Password
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
                <NavLink to="/sign-in" className="login-nav-link">Back to Sign In</NavLink>
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
