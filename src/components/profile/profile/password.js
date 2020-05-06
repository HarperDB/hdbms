import React, { useState } from 'react';
import { Row, Col, Input, Button, CardBody, Card } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';
import { useStoreState } from 'pullstate';

import appState from '../../../state/appState';

import usePersistedLMSAuth from '../../../state/persistedLMSAuth';

import updatePassword from '../../../api/lms/updatePassword';
import FormStatus from '../../shared/formStatus';

export default ({ formStateHeight }) => {
  const auth = useStoreState(appState, (s) => s.auth);
  const [, setPersistedLMSAuth] = usePersistedLMSAuth({});
  const [formState, setFormState] = useState({});
  const [formData, setFormData] = useState({});

  useAsyncEffect(async () => {
    const { oldpassword, newpassword, newpassword2 } = formData;
    const { submitted } = formState;
    if (submitted) {
      if (oldpassword !== auth.pass) {
        setFormState({ error: 'old password is incorrect' });
      } else if (newpassword !== newpassword2) {
        setFormState({ error: 'new passwords do not match' });
      } else if (!oldpassword || !newpassword || !newpassword2) {
        setFormState({ error: 'all fields are required' });
      } else {
        setFormState({ processing: true });

        const response = await updatePassword({ auth, user_id: auth.user_id, password: newpassword });
        if (response.error) {
          setFormState({ error: response.message });
        } else {
          setFormState({ success: response.message });
          appState.update((s) => {
            s.auth = {
              ...auth,
              pass: newpassword,
            };
          });
          setPersistedLMSAuth({ ...auth, pass: newpassword });
        }
      }
      setTimeout(() => setFormData({}), 2000);
    }
  }, [formState]);

  useAsyncEffect(() => setFormState({}), [formData]);

  return formState.processing ? (
    <FormStatus height={formStateHeight} status="processing" header="Updating Password" subhead="The Security Shepherd is mad-hashing." />
  ) : formState.success ? (
    <FormStatus height={formStateHeight} status="success" header="Success!" subhead={formState.success} />
  ) : formState.error ? (
    <FormStatus height={formStateHeight} status="error" header={formState.error} subhead="Please try again" />
  ) : (
    <>
      <Card className="mb-3">
        <CardBody>
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
                onChange={(e) => setFormData({ ...formData, oldpassword: e.target.value })}
                value={formData.oldpassword || ''}
                disabled={formState.submitted}
              />
            </Col>
            <Col xs="12">
              <hr className="my-2" />
            </Col>
            <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
              new password
            </Col>
            <Col md="6" xs="12">
              <Input
                type="password"
                className="mb-0 text-center"
                name="new password"
                placeholder="new password"
                onChange={(e) => setFormData({ ...formData, newpassword: e.target.value })}
                value={formData.newpassword || ''}
                disabled={formState.submitted}
              />
            </Col>
            <Col xs="12">
              <hr className="my-2" />
            </Col>
            <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
              verify password
            </Col>
            <Col md="6" xs="12">
              <Input
                type="password"
                className="mb-0 text-center"
                name="verify password"
                placeholder="verify password"
                onChange={(e) => setFormData({ ...formData, newpassword2: e.target.value })}
                value={formData.newpassword2 || ''}
                disabled={formState.submitted}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Button color="purple" block onClick={() => setFormState({ submitted: true })} disabled={formState.submitted}>
        Update Password
      </Button>
    </>
  );
};
