import React, { useState } from 'react';
import { Card, CardBody, Input, Button, Col, Row } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';

import usePersistedLMSAuth from '../../state/persistedLMSAuth';
import appState from '../../state/appState';

import updatePassword from '../../api/lms/updatePassword';
import handleEnter from '../../methods/util/handleEnter';

export default () => {
  const lmsAuth = useStoreState(appState, (s) => s.auth);
  const [, setPersistedLMSAuth] = usePersistedLMSAuth({});
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});
  const history = useHistory();

  useAsyncEffect(async () => {
    const { submitted, processing } = formState;
    if (submitted && !processing) {
      const { password, password2 } = formData;

      if (!password || !password2) {
        setFormState({
          error: 'all fields are required',
        });
        setTimeout(() => setFormData({}), 1000);
      } else if (password !== password2) {
        setFormState({
          error: 'passwords must match',
        });
        setTimeout(() => setFormData({}), 1000);
      } else {
        setFormState({
          processing: true,
        });
        const response = await updatePassword({
          auth: lmsAuth,
          ...lmsAuth,
          password,
        });
        if (response.error) {
          setFormState({
            error: response.message,
          });
          setTimeout(() => {
            setFormState({});
            setFormData({});
          }, 1000);
        } else {
          appState.update((s) => {
            s.auth = {
              ...lmsAuth,
              pass: password,
            };
          });
          setPersistedLMSAuth({
            ...lmsAuth,
            pass: password,
          });
          history.push('/sign-in');
        }
      }
    }
  }, [formState]);

  useAsyncEffect(() => {
    if (!formState.submitted) {
      setFormState({});
    }
  }, [formData]);

  return (
    <div id="login-form">
      <div id="login-logo" title="HarperDB Logo" />
      {formState.processing ? (
        <>
          <Card className="mb-3">
            <CardBody className="text-white text-center">
              updating your password
              <br />
              <br />
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
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                onKeyDown={(e) => handleEnter(e, setFormState)}
                disabled={formState.submitted}
                className="mb-2 text-center"
                type="password"
                title="password"
                placeholder="new password"
              />
              <Input
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password2: e.target.value,
                  })
                }
                onKeyDown={(e) => handleEnter(e, setFormState)}
                disabled={formState.submitted}
                className="mb-4 text-center"
                type="password"
                title="verify password"
                placeholder="verify password"
              />
              <Button
                onClick={() =>
                  setFormState({
                    submitted: true,
                  })
                }
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
            <div className="login-nav-link error">
              {formState.error}
              &nbsp;
            </div>
          ) : (
            <Row>
              <Col xs="6">
                <NavLink to="/sign-in" className="login-nav-link">
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
