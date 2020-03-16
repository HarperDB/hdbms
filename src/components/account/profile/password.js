import React, { useState } from 'react';
import { Row, Col, Input, Button } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';

import appState from '../../../state/stores/appState';

import usePersistedLMSAuth from '../../../state/stores/persistedLMSAuth';

import updatePassword from '../../../api/lms/updatePassword';

export default () => {
  const lmsAuth = useStoreState(appState, (s) => s.auth);
  const [, setPersistedLMSAuth] = usePersistedLMSAuth({});
  const [formState, setFormState] = useState({});
  const [formData, updateForm] = useState({});

  useAsyncEffect(async () => {
    const { oldpassword, newpassword, newpassword2 } = formData;
    const { submitted } = formState;
    if (submitted) {
      if (oldpassword !== lmsAuth.pass) {
        setFormState({ error: 'old password is incorrect' });
      } else if (newpassword !== newpassword2) {
        setFormState({ error: 'new passwords do not match' });
      } else if (!oldpassword || !newpassword || !newpassword2) {
        setFormState({ error: 'all fields are required' });
      } else {
        const response = await updatePassword({ auth: lmsAuth, payload: { user_id: lmsAuth.user_id, password: newpassword } });
        if (response.result === false) {
          setFormState({ error: response.message });
        } else {
          setFormState({ success: response.message });
          appState.update((s) => { s.auth = { ...lmsAuth, pass: newpassword }; });
          setPersistedLMSAuth({ ...lmsAuth, pass: newpassword });
        }
      }
    }
  }, [formState]);

  useAsyncEffect(() => setFormState({}), [formData]);

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
            onChange={(e) => updateForm({ ...formData, oldpassword: e.target.value })}
            value={formData.oldpassword || ''}
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
            onChange={(e) => updateForm({ ...formData, newpassword: e.target.value })}
            value={formData.newpassword || ''}
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
            onChange={(e) => updateForm({ ...formData, newpassword2: e.target.value })}
            value={formData.newpassword2 || ''}
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
            onClick={() => setFormState({ submitted: true })}
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
      {formState.success && (
        <div className="text-success text-small text-center text-italic">
          <hr />
          {formState.success}
        </div>
      )}
    </>
  );
};
