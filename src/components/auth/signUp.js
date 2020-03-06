import React, { useState } from 'react';
import { Input, Button, Row, Col, Card, CardBody } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { NavLink } from 'react-router-dom';

import isEmail from '../../util/isEmail';
import addCustomer from '../../api/lms/addCustomer';
import handleKeydown from '../../util/handleKeydown';

export default () => {
  const [formState, setFormState] = useState({ submitted: false, error: false, success: false });
  const [formData, updateForm] = useState({ firstname: '', lastname: '', email: '', company_name: '', subdomain: '' });

  useAsyncEffect(async () => {
    const { submitted } = formState;
    if (submitted) {
      const { firstname, lastname, email, company_name, subdomain } = formData;

      if (!firstname || !lastname || !email || !company_name || !subdomain) {
        setFormState({ submitted: false, error: 'All fields must be filled out' });
      } else if (!isEmail(email)) {
        setFormState({ submitted: false, error: 'Please provide a valid email' });
      } else {
        const response = await addCustomer({ payload: { firstname, lastname, email, company_name, subdomain } });
        if (response.result) {
          setFormState({ submitted: false, error: false, success: true });
        } else {
          setFormState({ submitted: false, error: response.message });
        }
      }
    }
  }, [formState]);

  useAsyncEffect(() => setFormState({ error: false, submitted: false, success: false }), [formData]);

  return (
    <div id="login-form" className="sign-up">
      <div id="login-logo" title="HarperDB Logo" />
      {formState.success ? (
        <Card className="mb-3 mt-2">
          <CardBody>
            <div className="text-center text-white pt-4">
              <b>Success!</b><br /><br />
              Check your email for your username and password.
            </div>
          </CardBody>
        </Card>
      ) : formState.submitted ? (
        <Card className="mb-3 mt-2">
          <CardBody>
            <div className="text-white text-center pt-4">
              <b>Creating Your Account</b><br /><br />
              <i className="fa fa-spinner fa-spin text-white" />
            </div>
          </CardBody>
        </Card>
      ) : (
        <>
          <Card className="mb-3 mt-2">
            <CardBody>
              <Input
                onKeyDown={(e) => handleKeydown(e, setFormState)}
                className="mb-2 text-center"
                type="text"
                title="first name"
                placeholder="first name"
                value={formData.firstname}
                disabled={formState.submitted}
                onChange={(e) => updateForm({ ...formData, firstname: e.target.value, error: false })}
              />
              <Input
                onKeyDown={(e) => handleKeydown(e, setFormState)}
                className="mb-2 text-center"
                type="text"
                title="last name"
                placeholder="last name"
                value={formData.lastname}
                disabled={formState.submitted}
                onChange={(e) => updateForm({ ...formData, lastname: e.target.value, error: false })}
              />
              <Input
                onKeyDown={(e) => handleKeydown(e, setFormState)}
                className="mb-2 text-center"
                type="text"
                title="email"
                placeholder="email"
                value={formData.email}
                disabled={formState.submitted}
                onChange={(e) => updateForm({ ...formData, email: e.target.value, error: false })}
              />
              <Input
                onKeyDown={(e) => handleKeydown(e, setFormState)}
                className="mb-2 text-center"
                type="text"
                title="company name"
                placeholder="company name"
                value={formData.company_name}
                disabled={formState.submitted}
                onChange={(e) => updateForm({ ...formData, company_name: e.target.value, error: false })}
              />
              <Row>
                <Col xs="6">
                  <Input
                    onKeyDown={(e) => handleKeydown(e, setFormState)}
                    className="mb-4 text-center"
                    type="text"
                    title="subdomain"
                    placeholder="subdomain"
                    value={formData.subdomain}
                    disabled={formState.submitted}
                    onChange={(e) => updateForm({ ...formData, subdomain: e.target.value, error: false })}
                  />
                </Col>
                <Col xs="6" className="pt-2 pl-0 text-white text-nowrap subdomain-label">
                  .harperdbcloud.com
                </Col>
              </Row>

              <Button
                color="purple"
                block
                disabled={formState.submitted}
                onClick={() => setFormState({ submitted: true, error: false })}
              >
                {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Sign Up For Free</span>}
              </Button>
            </CardBody>
          </Card>
          {formState.error ? (
            <div className="text-small text-white text-center">
              {formState.error}&nbsp;
            </div>
          ) : (
            <Row className="text-small">
              <Col xs="6" className="text-nowrap">
                <NavLink to="/sign-in" className="login-nav-link">Back to Sign In</NavLink>
              </Col>
              <Col xs="6" className="text-nowrap text-right">
                <NavLink to="/forgot-password" className="login-nav-link">Forgot Password</NavLink>
              </Col>
            </Row>
          )}
        </>
      )}
    </div>
  );
};
