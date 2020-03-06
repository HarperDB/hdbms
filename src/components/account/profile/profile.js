import React, { useState } from 'react';
import { Row, Col, Input, Button } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useAlert } from 'react-alert';

import updateUser from '../../../api/lms/updateUser';
import useApp from '../../../state/stores/appData';
import defaultAppData from '../../../state/defaults/defaultAppData';
import useLMS from '../../../state/stores/lmsAuth';
import defaultLMSAuth from '../../../state/defaults/defaultLMSAuth';
import getUser from '../../../api/lms/getUser';

export default () => {
  const alert = useAlert();
  const [lmsAuth] = useLMS(defaultLMSAuth);
  const [appData, setAppData] = useApp(defaultAppData);
  const [formState, setFormState] = useState({ submitted: false, error: false });
  const [formData, updateForm] = useState({ firstname: appData.user.firstname, lastname: appData.user.lastname, customer_id: appData.customer.customer_id, user_id: appData.user.user_id });

  useAsyncEffect(async () => {
    const { firstname, lastname, customer_id, user_id } = formData;
    const { submitted } = formState;
    if (submitted) {
      if (!firstname || !lastname) {
        setFormState({ error: 'all fields are required', submitted: false });
      } else {
        const response = await updateUser({ auth: lmsAuth, payload: { firstname, lastname, customer_id, user_id } });
        if (response.result === false) {
          setFormState({ error: response.message, submitted: false });
        } else {
          const user = await getUser({ auth: lmsAuth, payload: { email: appData.user.email } });
          setAppData({ ...appData, user });
          setFormState({ error: false, submitted: false });
          alert.success(response.message);
        }
      }
    }
  }, [formState]);

  useAsyncEffect(() => setFormState({ error: false, submitted: false }), [formData]);

  return (
    <>
      <Row>
        <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
          first name
        </Col>
        <Col md="6" xs="12">
          <Input
            type="text"
            className="mb-0 text-center"
            name="fname"
            placeholder="first name"
            onChange={(e) => updateForm({ ...formData, firstname: e.target.value, error: false })}
            value={formData.firstname}
            disabled={formState.submitted}
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
          last name
        </Col>
        <Col md="6" xs="12">
          <Input
            type="text"
            className="mb-0 text-center"
            name="lname"
            placeholder="last name"
            onChange={(e) => updateForm({ ...formData, lastname: e.target.value, error: false })}
            value={formData.lastname}
            disabled={formState.submitted}
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
          email address
        </Col>
        <Col md="6" xs="12">
          <div className="fake-input">{appData.user.email}</div>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col xs="6" />
        <Col md="6" xs="12">
          <Button
            color="purple"
            block
            onClick={() => setFormState({ submitted: true, error: false })}
            disabled={formState.submitted}
          >
            {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Save Profile</span>}
          </Button>
        </Col>
      </Row>
      {formState.error && (
        <div className="text-danger text-small text-center text-italic">
          <hr />
          {formState.error}
        </div>
      )}
    </>
  );
};
