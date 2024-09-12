import React, { useState, useEffect } from 'react';
import { Card, CardBody, Form, Input, Button, Row, Col } from 'reactstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { useStoreState } from 'pullstate';
import queryString from 'query-string';

import appState from '../../functions/state/appState';

import getUser from '../../functions/api/lms/getUser';
import isEmail from '../../functions/util/isEmail';
import Loader from '../shared/Loader';
import usePersistedUser from '../../functions/state/persistedUser';

function SignIn() {
  const { search } = useLocation();
  const { user, token } = queryString.parse(search, { decode: false });
  const theme = useStoreState(appState, (s) => s.theme);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});
  const [persistedUser, setPersistedUser] = usePersistedUser({});

  const submit = async () => {
    setFormState({ submitted: true });
    const { email, pass } = formData;
    if (!isEmail(email)) {
      setFormState({ error: 'a valid email is required' });
    } else if (!pass) {
      setFormState({ error: 'password is required' });
    } else if (theme === 'akamai' && formData.email.indexOf('harperdb.io') === -1 && formData.email.indexOf('akamai.com') === -1 && formData.email.indexOf('walmart.com') === -1) {
      setFormState({ error: 'portal access denied' });
    } else {
      setFormState({ processing: true });

      const newAuth = await getUser({ email, pass, loggingIn: true });

      if (!newAuth || newAuth?.error) {
        setFormState({ error: ['Unauthorized', 'User does not exist'].includes(newAuth?.message) ? 'Login Failed' : newAuth?.message || 'Login Failed' });
        setTimeout(() => setFormState({}), 5000);
      } else {
        setPersistedUser({ ...persistedUser, email, pass });
      }
    }
  };

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
              <Form>
                <div className="instructions">Please sign into HarperDB Studio</div>
                <Input
                  name="email"
                  autoComplete="email"
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
                  name="password"
                  autoComplete="current-password"
                  placeholder="password"
                />
                <Button id="signIn" onClick={submit} title="Sign In My Account" block color="purple" disabled={formState.submitted}>
                  Sign In
                </Button>
              </Form>
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
