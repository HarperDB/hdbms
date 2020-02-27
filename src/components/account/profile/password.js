import React, { useState } from 'react';
import { Row, Col, Input, Button } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import defaultProfileFormData from '../../../state/defaults/defaultProfileFormData';

export default () => {
  const [passwordForm, updatePasswordForm] = useState(defaultProfileFormData);

  useAsyncEffect(async () => {
    if (passwordForm.submitted) {
      console.log(passwordForm);
      // await updatePassword(passwordForm);
    }
  }, [passwordForm]);

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
            name="oldpassword"
            onChange={(e) => updatePasswordForm({ ...passwordForm, oldpassword: e.target.value, error: false })}
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
            name="newpassword"
            onChange={(e) => updatePasswordForm({ ...passwordForm, newpassword: e.target.value, error: false })}
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col xs="6" className="text text-nowrap d-none d-md-block pt-2">
          verify password
        </Col>
        <Col md="6" xs="12" className="text-sm-right text-center">
          <Input
            type="password"
            className="mb-0 text-center"
            name="newpassword2"
            onChange={(e) => updatePasswordForm({ ...passwordForm, newpassword2: e.target.value, error: false })}
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col xs="6" />
        <Col md="6" xs="12" className="text-sm-right text-center">
          <Button
            color="success"
            block
            onClick={() => updatePasswordForm({ ...passwordForm, submitted: true, error: false })}
          >
            Update Password
          </Button>
        </Col>
      </Row>
      {passwordForm.error && (
        <div className="text-danger text-small text-center text-italic">
          <hr />
          {passwordForm.error}
        </div>
      )}
    </>
  );
};
