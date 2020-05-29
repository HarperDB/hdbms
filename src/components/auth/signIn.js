import React, { useState } from 'react';
import { Card, CardBody, Input, Button, Row, Col } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import { NavLink, useLocation } from 'react-router-dom';
import queryString from 'query-string';

import usePersistedUser from '../../state/persistedUser';
import appState from '../../state/appState';

import getUser from '../../api/lms/getUser';
import isEmail from '../../methods/util/isEmail';
import AuthStateLoader from './authStateLoader';
import config from '../../../config';

export default () => {
  const [persistedUser, setPersistedUser] = usePersistedUser({});
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});
  const history = useHistory();
  const { search } = useLocation();
  const { returnURL } = queryString.parse(search);

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
        const response = await getUser({ email, pass });

        if (response.error) {
          setFormState({ error: 'Invalid Credentials' });
          appState.update((s) => {
            s.auth = false;
          });
          setPersistedUser({});
        } else {
          setPersistedUser({ ...persistedUser, email, pass });
          appState.update((s) => {
            s.auth = { ...response, email, pass };
          });
          const destination = response.update_password
            ? '/update-password'
            : !returnURL || returnURL === '/organizations' || returnURL === '/organizations/load' || returnURL === '/organizations/undefined'
            ? '/organizations/load'
            : `/organizations/load?returnURL=${returnURL}`;
          history.push(destination);
        }
      }
    }
  }, [formState]);

  useAsyncEffect(() => {
    if (!formState.submitted) setFormState({});
  }, [formData]);

  useAsyncEffect(() => {
    if (persistedUser && persistedUser.email && persistedUser.pass && !formState.processing) {
      setFormData(persistedUser);
      setTimeout(() => setFormState({ submitted: true }), 100);
    }
  }, [persistedUser]);

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
