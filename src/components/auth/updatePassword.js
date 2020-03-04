import React, { useState } from 'react';
import { Card, CardBody, Input, Button, Col, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router';

import updatePassword from '../../api/lms/updatePassword';
import handleKeydown from '../../util/handleKeydown';
import useLMS from '../../state/stores/lmsAuth';
import defaultLMSAuth from '../../state/defaults/defaultLMSAuth';
import useApp from '../../state/stores/appData';
import defaultAppData from '../../state/defaults/defaultAppData';

export default () => {
  const [lmsAuth, setLMSAuth] = useLMS(defaultLMSAuth);
  const [appData] = useApp(defaultAppData);
  const [formState, setFormState] = useState({ submitted: false, error: false });
  const [formData, updateForm] = useState({ password: false, password2: false });
  const history = useHistory();

  useAsyncEffect(async () => {
    const { password, password2 } = formData;
    const { submitted } = formState;
    if (submitted) {
      if (!password || !password2) {
        setFormState({ error: 'all fields are required', submitted: false });
      } else if (password !== password2) {
        setFormState({ error: 'passwords must match', submitted: false });
      } else {
        const response = await updatePassword({ auth: lmsAuth, payload: { email: lmsAuth.email, customer_id: appData.user.customer_id, password } });
        if (response.result === false) {
          setFormState({ error: response.message, submitted: false });
        } else {
          setFormState({ error: false, submitted: false });
          setLMSAuth({ ...lmsAuth, pass: password });
          history.push('/sign-in');
        }
      }
    }
  }, [formState]);

  useAsyncEffect(() => setFormState({ error: false, submitted: false }), [formData]);

  return (
    <div id="login-form">
      <div id="login-logo" title="HarperDB Logo" />
      <Card className="mb-3 mt-2">
        <CardBody>
          <Input
            onChange={(e) => updateForm({ ...formData, password: e.target.value })}
            onKeyDown={(e) => handleKeydown(e, setFormState)}
            disabled={formState.submitted}
            className="mb-2 text-center"
            type="text"
            title="password"
            placeholder="new password"
          />
          <Input
            onChange={(e) => updateForm({ ...formData, password2: e.target.value, error: false })}
            onKeyDown={(e) => handleKeydown(e, setFormState)}
            disabled={formState.submitted}
            className="mb-4 text-center"
            type="text"
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
            {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Update My Password</span>}
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
    </div>
  );
};
