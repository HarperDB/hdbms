import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Card, CardBody } from 'reactstrap';
import { NavLink, useLocation } from 'react-router-dom';
import useAsyncEffect from 'use-async-effect';
import queryString from 'query-string';
import { useStoreState } from 'pullstate';

import handleSignup from '../../functions/auth/handleSignup';
import Loader from '../shared/Loader';
import appState from '../../functions/state/appState';

function SignUp() {
  const { search } = useLocation();
  const { code, htuk, pageName, pageUri } = queryString.parse(search);
  const auth = useStoreState(appState, (s) => s.auth);
  const theme = useStoreState(appState, (s) => s.theme);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({ coupon_code: code, htuk, pageName, pageUri });
  const [showToolTip, setShowToolTip] = useState(false);

  useAsyncEffect(async () => {
    if (formState.submitted) {
      const newFormState = await handleSignup({ formData, theme });
      if (!auth.email && newFormState) setFormState(newFormState);
    }
  }, [formState]);

  useEffect(() => {
    if (!formState.submitted) setFormState({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  return formState.submitted ? (
    <div id="login-form">
      <Loader header="creating your account" spinner relative />
    </div>
  ) : (
    <div id="login-form" className="sign-up">
      <Card className="mb-3">
        <CardBody className="px-3" onKeyDown={(e) => e.keyCode !== 13 || setFormState({ submitted: true })}>
          <div className="sign-up-header">Sign Up And Launch Your Free HarperDB Cloud Instance Today</div>
          <Row>
            <Col xs="12" md="8">
              <div className="sign-up-content">
                <ul>
                  <li>Provision HarperDB Cloud and user-installed instances</li>
                  <li>Configure instance schemas, tables, users, roles, and clustering</li>
                  <li>Create and monitor real-time charts based on custom queries</li>
                  <li>Bulk data import via CSV upload or URL</li>
                </ul>

                <h3>Check Out Our Developer Resources Above</h3>

                <ul className="mt-3">
                  <li>SDKs, Drivers, and language-specific Code Snippets</li>
                  <li>Video Tutorials</li>
                  <li>HarperDB Migrator</li>
                </ul>

                <hr className="mt-4 mb-3" />

                <div className="d-none d-md-block">
                  <div className="disclaimer">
                    By creating an account, you agree to the&nbsp;
                    <a href="https://harperdb.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>
                    &nbsp;and&nbsp;
                    <a href="https://harperdb.io/legal/harperdb-cloud-terms-of-service/" target="_blank" rel="noopener noreferrer">
                      Terms of Service
                    </a>
                  </div>
                </div>
              </div>

              <hr className="mt-4 mb-3 d-block d-md-none" />
            </Col>
            <Col xs="12" md="4">
              <Form className="sign-up-form">
                <Input
                  id="firstname"
                  name="fname"
                  autoComplete="given-name"
                  className="text-center mb-2"
                  type="text"
                  title="first name"
                  placeholder="first name"
                  value={formData.firstname || ''}
                  disabled={formState.submitted}
                  onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                />
                <Input
                  id="lastname"
                  name="lname"
                  autoComplete="family-name"
                  className="text-center mb-2"
                  type="text"
                  title="last name"
                  placeholder="last name"
                  value={formData.lastname || ''}
                  disabled={formState.submitted}
                  onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                />
                <Input
                  id="email"
                  autoComplete="email"
                  name="email"
                  className="text-center mb-2"
                  type="text"
                  title="email"
                  placeholder="email"
                  value={formData.email || ''}
                  disabled={formState.submitted}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
                />
                <Row>
                  <Col className="subdomain-form">
                    <Input
                      id="subdomain"
                      name="subdomain"
                      className="text-center mb-2"
                      type="text"
                      title="subdomain"
                      placeholder="subdomain"
                      value={formData.subdomain || ''}
                      disabled={formState.submitted}
                      onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.substring(0, 15).toLowerCase() })}
                    />
                  </Col>
                  <Col className="subdomain-label">
                    .harperdbcloud.com{' '}
                    <Button color="link" onClick={() => setShowToolTip(!showToolTip)}>
                      <i className="fa fa-question-circle" />
                    </Button>
                  </Col>
                </Row>
                {showToolTip && <i className="subdomain-explanation">The URL of your HarperDB Cloud Instances</i>}
                <Input
                  id="coupon_code"
                  type="text"
                  className="text-center mb-2"
                  name="coupon_code"
                  title="coupon code"
                  placeholder="coupon code (optional)"
                  value={formData.coupon_code || ''}
                  onChange={(e) => setFormData({ ...formData, coupon_code: e.target.value })}
                  disabled={formState.submitted}
                />

                <div className="d-block d-md-none">
                  <hr />
                  <div className="disclaimer text-center">
                    By creating an account, you agree to the&nbsp;
                    <a href="https://harperdb.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>
                    &nbsp;and&nbsp;
                    <a href="https://harperdb.io/legal/harperdb-cloud-terms-of-service/" target="_blank" rel="noopener noreferrer">
                      Terms of Service
                    </a>
                  </div>
                  <hr />
                </div>

                <Button id="sign-up" color="purple" block disabled={formState.submitted} onClick={() => setFormState({ submitted: true })}>
                  {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Sign Up For Free</span>}
                </Button>
              </Form>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <div className="text-center">
        {formState.error ? (
          <div className="login-nav-link error">
            {formState.error}
            &nbsp;
          </div>
        ) : (
          <NavLink to="/" className="login-nav-link">
            Already Have An Account? Sign In Instead.
          </NavLink>
        )}
      </div>
    </div>
  );
}

export default SignUp;
