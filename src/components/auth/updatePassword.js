import React, { useEffect, useState } from 'react';
import { Card, CardBody, Input, Button, Col, Row } from 'reactstrap';
import useAsyncEffect from 'use-async-effect';
import { NavLink } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import appState from '../../functions/state/appState';

import updatePassword from '../../functions/api/lms/updatePassword';
import config from '../../config';
import Loader from '../shared/loader';

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
        setTimeout(() => setFormState({}), 2000);
      } else if (password !== password2) {
        setFormState({ error: 'passwords must match' });
        setTimeout(() => setFormState({}), 2000);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.passwordError]);

  useAsyncEffect(() => !formState.submitted && setFormState({}), [formData]);

  return (
    <div id="login-form">
      <div id="login-logo" title="HarperDB Logo" />
      <div className="version">Studio v{config.studio_version}</div>
      {formState.processing ? (
        <Loader header="adding account password" spinner relative />
      ) : (
        <>
          <Card className="mb-3">
            <CardBody onKeyDown={(e) => e.keyCode !== 13 || setFormState({ submitted: true })}>
              <Input
                id="password1"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={formState.submitted}
                className="mb-2 text-center"
                type="password"
                title="password"
                placeholder="add password"
              />
              <Input
                id="password2"
                onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
                disabled={formState.submitted}
                className="mb-4 text-center"
                type="password"
                title="verify password"
                placeholder="verify password"
              />
              <Button id="updateMyPassword" onClick={() => setFormState({ submitted: true })} disabled={formState.submitted} title="Add Account Password" block color="purple">
                Add Account Password
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
