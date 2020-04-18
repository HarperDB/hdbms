import React, { useState, useEffect } from 'react';
import { Input, Button, Row, Col, Card, CardBody, Tooltip } from '@nio/ui-kit';
import { NavLink, useLocation } from 'react-router-dom';
import useAsyncEffect from 'use-async-effect';
import queryString from 'query-string';

import handleSignup from '../../methods/auth/handleSignup';
import handleKeydown from '../../methods/util/handleKeydown';

export default () => {
  const { search } = useLocation();
  const { code } = queryString.parse(search);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({ coupon_code: code });
  const [showToolTip, setShowToolTip] = useState(false);

  useAsyncEffect(async () => {
    if (formState.submitted) {
      const newFormState = await handleSignup({ formData });
      if (newFormState) {
        setFormState(newFormState);
      }
    }
  }, [formState]);

  useEffect(() => {
    if (!formState.submitted) {
      setFormState({});
    }
  }, [formData]);

  return (
    <div id="login-form" className="sign-up">
      <div id="login-logo" title="HarperDB Logo" />
      {formState.submitted ? (
        <>
          <Card className="mb-3">
            <CardBody className="text-white text-center">
              creating your account
              <br />
              <br />
              <i className="fa fa-spinner fa-spin text-white" />
            </CardBody>
          </Card>
          <div className="login-nav-link">&nbsp;</div>
        </>
      ) : formState.success ? (
        <>
          <Card className="mb-3">
            <CardBody>
              <div className="text-center text-white">
                success!
                <br />
                <br />
                check your email for your username and password.
              </div>
            </CardBody>
          </Card>
          <Row>
            <Col xs="6">
              <NavLink to="/sign-in" className="login-nav-link">
                Sign In
              </NavLink>
            </Col>
            <Col xs="6" className="text-right">
              <NavLink to="/resend-registration-email" className="login-nav-link">
                Resend Email
              </NavLink>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Card className="mb-3">
            <CardBody>
              <Input
                onKeyDown={(e) => handleKeydown(e, setFormState)}
                className="mb-2 text-center"
                type="text"
                title="first name"
                placeholder="first name"
                value={formData.firstname || ''}
                disabled={formState.submitted}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    firstname: e.target.value,
                  })
                }
              />
              <Input
                onKeyDown={(e) => handleKeydown(e, setFormState)}
                className="mb-2 text-center"
                type="text"
                title="last name"
                placeholder="last name"
                value={formData.lastname || ''}
                disabled={formState.submitted}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lastname: e.target.value,
                  })
                }
              />
              <Input
                onKeyDown={(e) => handleKeydown(e, setFormState)}
                className="mb-2 text-center"
                type="text"
                title="email"
                placeholder="email"
                value={formData.email || ''}
                disabled={formState.submitted}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />
              <Input
                onKeyDown={(e) => handleKeydown(e, setFormState)}
                className="mb-2 text-center"
                type="text"
                title="company name"
                placeholder="company name"
                value={formData.customer_name || ''}
                disabled={formState.submitted}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customer_name: e.target.value,
                  })
                }
              />
              <Row>
                <Col className="subdomain-form">
                  <Input
                    onKeyDown={(e) => handleKeydown(e, setFormState)}
                    className="mb-2 text-center"
                    type="text"
                    title="subdomain"
                    placeholder="subdomain"
                    value={formData.subdomain || ''}
                    disabled={formState.submitted}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subdomain: e.target.value.substring(0, 15),
                      })
                    }
                  />
                </Col>
                <Col className="subdomain-label">
                  .harperdbcloud.com{' '}
                  <a id="subdomainHelp" onClick={() => setShowToolTip(!showToolTip)}>
                    <i className="fa fa-question-circle" />
                  </a>
                </Col>
              </Row>
              <Input
                type="text"
                className="text-center mb-3"
                name="coupon_code"
                title="coupon code"
                placeholder="coupon code (optional)"
                value={formData.coupon_code || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coupon_code: e.target.value,
                  })
                }
                disabled={formState.submitted}
              />
              <div className="mb-3 disclaimer">
                By creating an account, I certify that I have read and agree to the HarperDB{' '}
                <a href="https://harperdb.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="https://harperdb.io/legal/harperdb-cloud-terms-of-service/" target="_blank" rel="noopener noreferrer">
                  HarperDB Cloud Terms of Service
                </a>
                .
              </div>
              <Button
                color="purple"
                block
                disabled={formState.submitted}
                onClick={() =>
                  setFormState({
                    submitted: true,
                  })
                }
              >
                {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Sign Up For Free</span>}
              </Button>
            </CardBody>
          </Card>
          {formState.error ? (
            <div className="login-nav-link error">
              {formState.error}
              &nbsp;
            </div>
          ) : (
            <div className="text-center">
              <NavLink to="/sign-in" className="login-nav-link">
                Already Have An Account? Sign In Instead.
              </NavLink>
            </div>
          )}
          <Tooltip isOpen={showToolTip} placement="top-end" target="subdomainHelp" className="subdomain-tooltip">
            The URL you will use to reach HarperDB Cloud Instances.
          </Tooltip>
        </>
      )}
    </div>
  );
};
