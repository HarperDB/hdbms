import React, { useState, useEffect } from 'react';
import { Card, CardBody, Input, Button, Row, Col } from 'reactstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import queryString from 'query-string';

import appState from '../../functions/state/appState';

import getUser from '../../functions/api/lms/getUser';
import isEmail from '../../functions/util/isEmail';
import Loader from '../shared/Loader';

function SignIn() {
  const { search } = useLocation();
  const { user, token } = queryString.parse(search, { decode: false });
  const auth = useStoreState(appState, (s) => s.auth);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});

  const submit = () => {
    setFormState({ submitted: true });
    const { email, pass } = formData;
    if (!isEmail(email)) {
      setFormState({ error: 'a valid email is required' });
    } else if (!pass) {
      setFormState({ error: 'password is required' });
    } else {
      setFormState({ processing: true });
      getUser({ email, pass, loggingIn: true });
    }
  };

  useEffect(() => {
    if (auth?.error) {
      setFormState({ error: ['Unauthorized', 'User does not exist'].includes(auth.message) ? 'Login Failed' : auth.message });
      setTimeout(() => setFormState({}), 3000);
    }
  }, [auth]);

  useEffect(
    () => !formState.submitted && setFormState({}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formData]
  );

  useEffect(() => {
    if (user && token) {
      getUser({ email: user, pass: token, loggingIn: true });
    }
  }, [user, token]);

  return (
    <div id="login-form">
      {formState.processing ? (
        <Loader header="signing in" spinner relative />
      ) : (
        <>
          <Card className="mb-3">
            <CardBody onKeyDown={(e) => e.keyCode !== 13 || submit()}>
              <div className="instructions">Please sign into HarperDB Studio</div>
              <Input
                id="email"
                onChange={(e) => {
                  e.currentTarget.focus();
                  setFormData({ ...formData, email: e.target.value.trim().toLowerCase() });
                }}
                value={formData.email || ''}
                disabled={formState.submitted}
                className="mb-2 text-center"
                type="text"
                title="email"
                autoComplete="username"
                placeholder="email address"
              />
              <Input
                id="password"
                onChange={(e) => {
                  e.currentTarget.focus();
                  setFormData({ ...formData, pass: e.target.value });
                }}
                value={formData.pass || ''}
                disabled={formState.submitted}
                className="mb-2 text-center"
                type="password"
                title="password"
                autoComplete="current-password"
                placeholder="password"
              />
              <Button id="signIn" onClick={submit} title="Sign In My Account" block color="purple" disabled={formState.submitted}>
                Sign In
              </Button>
            </CardBody>
          </Card>
          {formState.error ? (
            <div className="login-nav-link error">{formState.error}</div>
          ) : (
            <Row>
              <Col xs="6">
                <NavLink to="/sign-up" className="login-nav-link">
                  Sign Up for Free
                </NavLink>
              </Col>
              <Col xs="6" className="text-end">
                <NavLink to="/reset-password" className="login-nav-link">
                  Reset Password
                </NavLink>
              </Col>
            </Row>
          )}
        </>
      )}
    </div>
  );
}

export default SignIn;
