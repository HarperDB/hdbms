import React, { useState } from 'react';
import { Card, CardBody, Input, Button, Row, Col } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import usePersistedUser from '../../state/persistedUser';

import getUser from '../../api/lms/getUser';
import isEmail from '../../methods/util/isEmail';
import AuthStateLoader from '../shared/authStateLoader';
import config from '../../../config';
import appState from '../../state/appState';

export default () => {
  const auth = useStoreState(appState, (s) => s.auth);
  const [persistedUser, setPersistedUser] = usePersistedUser({});
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});
  const history = useHistory();

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const { email, pass } = formData;
      if (!isEmail(email)) {
        setFormState({ error: 'a valid email is required' });
      } else if (!pass) {
        setFormState({ error: 'password is required' });
      } else {
        setFormState({ processing: true });
        getUser({ email, pass });
      }
    }
  }, [formState]);

  useAsyncEffect(() => !formState.submitted && setFormState({}), [formData]);

  useAsyncEffect(() => {
    appState.update((s) => {
      s.auth = false;
      s.customer = false;
      s.users = false;
      s.instances = false;
      s.hasCard = false;
      s.lastUpdate = false;
    });
    setPersistedUser({});
  }, []);

  useAsyncEffect(() => {
    if (auth?.error) {
      setFormState({ error: auth.message === 'Unauthorized' ? 'Login Failed' : auth.message });
      setTimeout(() => setFormState({}), 3000);
    } else if (auth?.email && auth?.pass) {
      setPersistedUser({ ...persistedUser, email: auth.email, pass: auth.pass });
      history.push(auth.update_password ? '/update-password' : '/organizations');
    }
  }, [auth]);

  return (
    <div id="login-form">
      <div id="login-logo" title="HarperDB Logo" />
      <div className="version">Studio v{config.studio_version}</div>
      {formState.processing ? (
        <AuthStateLoader header="signing in" spinner />
      ) : (
        <>
          <Card className="mb-3">
            <CardBody onKeyDown={(e) => e.keyCode !== 13 || setFormState({ submitted: true })}>
              <Input
                onChange={(e) => {
                  e.currentTarget.focus();
                  setFormData({ ...formData, email: e.target.value.toLowerCase() });
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
                onChange={(e) => {
                  e.currentTarget.focus();
                  setFormData({ ...formData, pass: e.target.value });
                }}
                value={formData.pass || ''}
                disabled={formState.submitted}
                className="mb-4 text-center"
                type="password"
                title="password"
                autoComplete="current-password"
                placeholder="password"
              />
              <Button onClick={() => setFormState({ submitted: true })} title="Sign In My Account" block color="purple" disabled={formState.submitted}>
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
              <Col xs="6" className="text-right">
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
};
