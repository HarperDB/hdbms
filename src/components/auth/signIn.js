import React, { useState } from 'react';
import { Card, CardBody, Input, Button, Row, Col } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useHistory } from 'react-router';
import { NavLink, useLocation } from 'react-router-dom';
import queryString from 'query-string';

import usePersistedLMSAuth from '../../state/stores/persistedLMSAuth';
import appState from '../../state/stores/appState';

import getUser from '../../api/lms/getUser';
import isEmail from '../../util/isEmail';
import handleKeydown from '../../util/handleKeydown';

export default () => {
  const [persistedLMSAuth, setPersistedLMSAuth] = usePersistedLMSAuth({});
  const [formState, setFormState] = useState({});
  const [formData, updateForm] = useState({});
  const history = useHistory();
  const { search } = useLocation();
  const { returnURL } = queryString.parse(search);

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const { email, pass } = formData;
      if (!email || !pass) {
        setFormState({
          error: 'all fields are required',
        });
        setTimeout(() => setFormState({}), 1000);
      } else if (!isEmail(email)) {
        setFormState({
          error: 'invalid email',
        });
        setTimeout(() => setFormState({}), 1000);
      } else {
        setFormState({
          processing: true,
        });
        const response = await getUser({
          auth: { email, pass },
          payload: { email },
        });
        if (response.result === false) {
          setFormState({
            error: 'Invalid Credentials',
          });
          appState.update((s) => {
            s.auth = false;
          });
          setPersistedLMSAuth({});
          setTimeout(() => {
            setFormState({});
            updateForm({});
          }, 1000);
        } else {
          setPersistedLMSAuth({
            email,
            pass,
          });
          appState.update((s) => {
            s.auth = {
              ...response,
              email,
              pass,
            };
          });
          setTimeout(() => history.push(response.update_password ? '/update-password' : returnURL || '/instances'), 1000);
        }
      }
    }
  }, [formState]);

  useAsyncEffect(() => {
    if (!formState.submitted) {
      setFormState({});
    }
  }, [formData]);

  useAsyncEffect(() => {
    const { email, pass } = persistedLMSAuth;
    const { processing } = formState;
    if (email && pass && !processing) {
      updateForm({ email, pass });
      setFormState({ submitted: true });
    }
  }, [persistedLMSAuth]);

  return (
    <div id="login-form">
      <div id="login-logo" title="HarperDB Logo" />
      {formState.processing ? (
        <>
          <Card className="mb-3">
            <CardBody className="text-white text-center">
              <div className="mb-3">signing in</div>
              <i className="fa fa-spinner fa-spin text-white" />
            </CardBody>
          </Card>
          <div className="login-nav-link">&nbsp;</div>
        </>
      ) : (
        <>
          <Card className="mb-3">
            <CardBody>
              <Input
                onChange={(e) =>
                  updateForm({
                    ...formData,
                    email: e.target.value,
                  })
                }
                onKeyDown={(e) => handleKeydown(e, setFormState)}
                disabled={formState.submitted}
                className="mb-2 text-center"
                type="text"
                title="email"
                autoComplete="false"
                placeholder="email address"
              />
              <Input
                onChange={(e) =>
                  updateForm({
                    ...formData,
                    pass: e.target.value,
                  })
                }
                onKeyDown={(e) => handleKeydown(e, setFormState)}
                disabled={formState.submitted}
                className="mb-4 text-center"
                type="password"
                title="password"
                autoComplete="false"
                placeholder="password"
              />
              <Button
                onClick={() =>
                  setFormState({
                    submitted: true,
                  })
                }
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
