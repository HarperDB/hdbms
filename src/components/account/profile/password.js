import React, { useState } from 'react';
import { Row, Col, Input, Button } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useAlert } from 'react-alert';

import useLMS from '../../../state/stores/lmsAuth';
import defaultLMSAuth from '../../../state/defaults/defaultLMSAuth';

import updatePassword from '../../../api/lms/updatePassword';

export default () => {
  const alert = useAlert();
  const [lmsAuth, setLMSAuth] = useLMS(defaultLMSAuth);
  const [formState, setFormState] = useState({ submitted: false, error: false });
  const [formData, updateForm] = useState({ oldpassword: '', newpassword: '', newpassword2: '', user_id: lmsAuth.user_id });

  useAsyncEffect(async () => {
    const { oldpassword, newpassword, newpassword2, user_id } = formData;
    const { submitted } = formState;
    if (submitted) {
      if (oldpassword !== lmsAuth.pass) {
        setFormState({ error: 'old password is incorrect', submitted: false });
      } else if (newpassword !== newpassword2) {
        setFormState({ error: 'new passwords do not match', submitted: false });
      } else if (!oldpassword || !newpassword || !newpassword2) {
        setFormState({ error: 'all fields are required', submitted: false });
      } else {
        const response = await updatePassword({ auth: lmsAuth, payload: { user_id, password: newpassword } });
        if (response.result === false) {
          setFormState({ error: response.message, submitted: false });
        } else {
          alert.success(response.message);
          setFormState({ error: false, submitted: false });
          setLMSAuth({ ...lmsAuth, pass: newpassword });
        }
      }
    }
  }, [formState]);

  useAsyncEffect(() => setFormState({ error: false, submitted: false }), [formData]);

  return (
    <>
      <Row>
        <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
          current password
        </Col>
        <Col md="6" xs="12">
          <Input
            type="password"
            className="mb-0 text-center"
            name="current password"
            placeholder="current password"
            onChange={(e) => updateForm({ ...formData, oldpassword: e.target.value, error: false })}
            value={formData.oldpassword}
            disabled={formState.submitted}
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
          new password
        </Col>
        <Col md="6" xs="12">
          <Input
            type="password"
            className="mb-0 text-center"
            name="new password"
            placeholder="new password"
            onChange={(e) => updateForm({ ...formData, newpassword: e.target.value, error: false })}
            value={formData.newpassword}
            disabled={formState.submitted}
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
          verify password
        </Col>
        <Col md="6" xs="12">
          <Input
            type="password"
            className="mb-0 text-center"
            name="verify password"
            placeholder="verify password"
            onChange={(e) => updateForm({ ...formData, newpassword2: e.target.value, error: false })}
            value={formData.newpassword2}
            disabled={formState.submitted}
          />
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
            {formState.submitted ? <i className="fa fa-spinner fa-spin text-white" /> : <span>Update Password</span>}
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
