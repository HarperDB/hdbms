import React, { useState } from 'react';
import { Row, Col, Input, Button } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import { useStoreState } from 'pullstate';

import appState from '../../../state/stores/appState';

import updateUser from '../../../api/lms/updateUser';
import getUser from '../../../api/lms/getUser';

export default () => {
  const auth = useStoreState(appState, (s) => s.auth);
  const [formState, setFormState] = useState({});
  const [formData, updateForm] = useState(auth);

  useAsyncEffect(async () => {
    const { firstname, lastname, customer_id, user_id } = formData;
    const { submitted } = formState;
    if (submitted) {
      if (!firstname || !lastname) {
        setFormState({ error: 'all fields are required' });
      } else {
        const response = await updateUser({ auth, payload: { firstname, lastname, customer_id, user_id } });
        if (response.result === false) {
          setFormState({ error: response.message });
        } else {
          const user = await getUser({ auth, payload: { email: auth.email } });
          appState.update((s) => { s.auth = { ...auth, ...user }; });
          setFormState({ success: response.message });
        }
      }
    }
  }, [formState]);

  useAsyncEffect(() => setFormState({}), [formData]);

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
            onChange={(e) => updateForm({ ...formData, firstname: e.target.value })}
            value={formData.firstname || ''}
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
            onChange={(e) => updateForm({ ...formData, lastname: e.target.value })}
            value={formData.lastname || ''}
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
          <div className="fake-input">{auth.email}</div>
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
      {formState.success && (
        <div className="text-success text-small text-center text-italic">
          <hr />
          {formState.success}
        </div>
      )}
    </>
  );
};
