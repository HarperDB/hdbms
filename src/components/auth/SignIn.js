import React, { useState, useEffect } from 'react';
import { Card, CardBody, Form, Input, Button, Row, Col, Label } from 'reactstrap';
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
    <div className="login-form">
      {formState.processing ? (
        <Loader header="signing in" spinner relative />
      ) : (
        <>
          <Form>
            <h2 className="instructions mb-2">Sign in to HarperDB Studio</h2>
            <span className="login-nav-link error d-inline-block">{formState.error}</span>
            <Label className="d-block mb-3">
              <span className="mb-2 d-inline-block">Email</span>
              <Input
                name="email"
                autoComplete="email"
                required
                id="email"
                onChange={(e) => {
                  e.currentTarget.focus();
                  setFormData({ ...formData, email: e.target.value.trim().toLowerCase() });
                }}
                value={formData.email || ''}
                disabled={formState.submitted}
                type="text"
                title="email"
                placeholder="email address"
              />
            </Label>
            <Label className="d-block mb-4">
              <span className="mb-2 d-inline-block">Password</span>
              <Input
                id="password"
                required
                onChange={(e) => {
                  e.currentTarget.focus();
                  setFormData({ ...formData, pass: e.target.value });
                }}
                value={formData.pass || ''}
                disabled={formState.submitted}
                type="password"
                title="password"
                name="password"
                autoComplete="current-password"
                placeholder="password"
              />
            </Label>
            <Button id="signIn" className="rounded-pill btn-gradient-blue border-0" onClick={submit} title="Sign In My Account" block disabled={formState.submitted}>
              Sign In
            </Button>
          </Form>
          <div className="mt-3 d-flex justify-content-between px-4">
            <NavLink to="/sign-up" className="login-nav-link d-inline-block">
              Sign Up for Free
            </NavLink>
            <NavLink to="/reset-password" className="login-nav-link d-inline-block">
              Reset Password
            </NavLink>
          </div>
        </>
      )}
    </div>
  );
}

export default SignIn;
