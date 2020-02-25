import React, { useState } from 'react';
import { Row, Col, Input, Button } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import defaultProfileFormData from '../../util/state/defaultProfileFormData';

export default () => {
  const [profileForm, updateProfileForm] = useState(defaultProfileFormData);

  useAsyncEffect(async () => {
    if (profileForm.submitted) {
      console.log(profileForm);
      // await updateProfile(profileForm);
    }
  }, [profileForm]);

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
            name="first name"
            placeholder="first name"
            onChange={(e) => updateProfileForm({ ...profileForm, firstname: e.target.value, error: false })}
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
            name="lastname"
            placeholder="last name"
            onChange={(e) => updateProfileForm({ ...profileForm, lastname: e.target.value, error: false })}
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
          email address
        </Col>
        <Col md="6" xs="12">
          <Input
            type="text"
            className="mb-0 text-center"
            name="email"
            placeholder="email address"
            onChange={(e) => updateProfileForm({ ...profileForm, email: e.target.value, error: false })}
          />
        </Col>
      </Row>
      <hr />
      {profileForm.error && (
        <div className="text-danger text-small text-center text-italic">
          {profileForm.error}
          <hr />
        </div>
      )}
      <Button
        color="success"
        block
        onClick={() => updateProfileForm({ ...profileForm, submitted: true, error: false })}
      >
        Save Profile
      </Button>
    </>
  );
};
