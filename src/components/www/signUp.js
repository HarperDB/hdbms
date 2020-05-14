import React, { useState, useEffect } from 'react';
import { Input, Button, Row, Col, Tooltip } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';

import ContentContainer from '../shared/contentContainer';
import handleSignup from '../../methods/auth/handleSignup';

export default () => {
  const { search } = useLocation();
  const { code, htuk, pageName, pageUri } = queryString.parse(search);
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({ coupon_code: code, htuk, pageName, pageUri });
  const [showToolTip, setShowToolTip] = useState(false);

  useAsyncEffect(async () => {
    if (formState.submitted) {
      const newFormState = await handleSignup({ formData });
      if (newFormState) setFormState(newFormState);
    }
  }, [formState]);

  useEffect(() => {
    if (!formState.submitted) setFormState({});
  }, [formData]);

  return (
    <div id="standalone">
      {formState.submitted ? (
        <div className="p-4 text-center">
          <b>creating account</b>
          <br />
          <br />
          <i className="fa fa-lg fa-spinner fa-spin text-purple" />
          <br />
          <br />
          The Account Poodle is typing fur-iously.
        </div>
      ) : formState.success ? (
        <div className="p-4 text-center">
          <b>success!</b>
          <br />
          <br />
          <i className="fa fa-lg fa-check-circle text-success" />
          <br />
          <br />
          Check your email for your username and password.
          <br />
          <br />
          Be sure to check your spam folder, just in case.
        </div>
      ) : (
        <>
          <ContentContainer header="First Name" className="mb-3">
            <Input
              type="text"
              name="firstname"
              value={formData.firstname || ''}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              disabled={formState.submitted}
            />
          </ContentContainer>
          <ContentContainer header="Last Name" className="mb-3">
            <Input
              type="text"
              name="lastname"
              value={formData.lastname || ''}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              disabled={formState.submitted}
            />
          </ContentContainer>
          <ContentContainer header="Email Address" className="mb-3">
            <Input
              type="text"
              name="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
              disabled={formState.submitted}
            />
          </ContentContainer>
          <ContentContainer header="Subdomain (16 characters max)" className="mb-3">
            <Row noGutters>
              <Col xs="8">
                <Input
                  type="text"
                  name="customer_name"
                  value={formData.subdomain || ''}
                  onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.substring(0, 15) })}
                  disabled={formState.submitted}
                />
              </Col>
              <Col xs="4" className="pt-2 pl-1 text-nowrap">
                .harperdbcloud.com{' '}
                <a id="subdomainHelp" onClick={() => setShowToolTip(!showToolTip)}>
                  <i className="fa fa-question-circle" />
                </a>
              </Col>
            </Row>
          </ContentContainer>
          <ContentContainer header="Coupon Code (optional)" className="mb-3">
            <Input
              type="text"
              name="coupon_code"
              value={formData.coupon_code || ''}
              onChange={(e) => setFormData({ ...formData, coupon_code: e.target.value })}
              disabled={formState.submitted}
            />
          </ContentContainer>
          <div className="text-small pt-3 pb-4">
            By creating an account, I certify that I have read and agree to the HarperDB{' '}
            <a href="https://harperdb.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="https://harperdb.io/legal/harperdb-cloud-terms-of-service/" target="_blank" rel="noopener noreferrer">
              HarperDB Cloud Terms of Service
            </a>
          </div>
          <Button color="success" block onClick={() => setFormState({ submitted: true })} disabled={formState.submitted}>
            {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Create A Free HarperDB Account</span>}
          </Button>
          {formState.error && (
            <div className="text-danger text-small text-center text-italic">
              <hr />
              {formState.error}
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
