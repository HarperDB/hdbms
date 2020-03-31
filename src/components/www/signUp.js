import React, { useState } from 'react';
import { Input, Button, Row, Col, CardBody } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import isEmail from '../../util/isEmail';
import addCustomer from '../../api/lms/addCustomer';
import ContentContainer from '../shared/contentContainer';

export default () => {
  const [formState, setFormState] = useState({});
  const [formData, updateForm] = useState({});

  useAsyncEffect(async () => {
    const { submitted, processing } = formState;
    if (submitted && !processing) {
      const { firstname, lastname, email, customer_name, subdomain, coupon_code } = formData;

      if (!firstname || !lastname || !email || !customer_name || !subdomain) {
        setFormState({ error: 'All fields must be filled out' });
        setTimeout(() => updateForm({}), 1000);
      } else if (!isEmail(email)) {
        setFormState({ error: 'Please provide a valid email' });
        setTimeout(() => updateForm({}), 1000);
      } else {
        setFormState({ ...formState, processing: true });
        const response = await addCustomer({ payload: { firstname, lastname, email, customer_name, subdomain, coupon_code } });
        if (response.result === false) {
          setFormState({ error: response.message });
          setTimeout(() => {
            setFormState({});
            updateForm({});
          }, 1000);
        } else {
          setFormState({ success: true });
        }
      }
    }
  }, [formState]);

  useAsyncEffect(() => { if (!formState.submitted) { setFormState({}); } }, [formData]);

  return (
    <div id="standalone">
      {formState.processing ? (
        <div className="p-4 text-center">
          <b>creating account</b><br /><br />
          <i className="fa fa-lg fa-spinner fa-spin text-purple" /><br /><br />
          the office dogs are typing furiously.
        </div>
      ) : formState.success ? (
        <div className="p-4 text-center">
          <b>success!</b><br /><br />
          <i className="fa fa-lg fa-thumbs-up text-purple" /><br /><br />
          check your email for your username and password
        </div>
      ) : (
        <>
          <ContentContainer header="First Name" className="mb-3">
            <Input
              type="text"
              name="firstname"
              value={formData.firstname || ''}
              onChange={(e) => updateForm({ ...formData, firstname: e.target.value })}
              disabled={formState.submitted}
            />
          </ContentContainer>

          <ContentContainer header="Last Name" className="mb-3">
            <Input
              type="text"
              name="lastname"
              value={formData.lastname || ''}
              onChange={(e) => updateForm({ ...formData, lastname: e.target.value })}
              disabled={formState.submitted}
            />
          </ContentContainer>

          <ContentContainer header="Email Address" className="mb-3">
            <Input
              type="text"
              name="email"
              value={formData.email || ''}
              onChange={(e) => updateForm({ ...formData, email: e.target.value })}
              disabled={formState.submitted}
            />
          </ContentContainer>

          <ContentContainer header="Company" className="mb-3">
            <Input
              type="text"
              name="customer_name"
              value={formData.customer_name || ''}
              onChange={(e) => updateForm({ ...formData, customer_name: e.target.value })}
              disabled={formState.submitted}
            />
          </ContentContainer>

          <ContentContainer header="Subdomain" className="mb-3">
            <Row noGutters>
              <Col xs="8">
                <Input
                  type="text"
                  name="customer_name"
                  value={formData.subdomain || ''}
                  onChange={(e) => updateForm({ ...formData, subdomain: e.target.value })}
                  disabled={formState.submitted}
                />
              </Col>
              <Col xs="4" className="pt-2 pl-1 text-nowrap">
                .harperdbcloud.com
              </Col>
            </Row>
          </ContentContainer>

          <ContentContainer header="Coupon Code (optional)" className="mb-3">
            <Input
              type="text"
              name="coupon_code"
              value={formData.coupon_code || ''}
              onChange={(e) => updateForm({ ...formData, coupon_code: e.target.value })}
              disabled={formState.submitted}
            />
          </ContentContainer>

          <div className="text-small text-center pt-3 pb-4">
            By creating an account, I certify that I have read and agree to the HarperDB <a href="https://harperdb.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href="https://harperdb.io/legal/harperdb-cloud-terms-of-service/" target="_blank" rel="noopener noreferrer">HarperDB Cloud Terms of Service</a>.
          </div>

          <Button
            color="success"
            block
            onClick={() => setFormState({ submitted: true })}
            disabled={formState.submitted}
          >
            {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Create A Free HarperDB Account</span>}
          </Button>
          {formState.error && (
            <div className="text-danger text-small text-center text-italic">
              <hr />
              {formState.error}
            </div>
          )}
        </>
      )}
    </div>
  );
};
