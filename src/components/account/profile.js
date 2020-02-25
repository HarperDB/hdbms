import React, { useState } from 'react';
import { Row, Col, Input, Button, Card, CardBody } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import defaultProfileFormData from '../../util/state/defaultProfileFormData';

export default () => {
  const [passwordForm, updatePasswordForm] = useState(defaultProfileFormData);
  const [profileForm, updateProfileForm] = useState(defaultProfileFormData);

  useAsyncEffect(async () => {
    if (passwordForm.submitted) {
      console.log(passwordForm);
      // await updatePassword(passwordForm);
    }
  }, [passwordForm]);

  useAsyncEffect(async () => {
    if (profileForm.submitted) {
      console.log(profileForm);
      // await updateProfile(profileForm);
    }
  }, [profileForm]);

  return (
    <Row>
      <Col md="6" className="mb-4">
        <span className="text-white mb-2">profile</span>
        <Card className="my-3">
          <CardBody>
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
          </CardBody>
        </Card>
      </Col>
      <Col md="6" className="mb-4">
        <span className="text-white mb-2">password</span>
        <Card className="my-3">
          <CardBody>
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
            {passwordForm.error && (
              <div className="text-danger text-small text-center text-italic">
                {passwordForm.error}
                <hr />
              </div>
            )}
            <Button
              color="success"
              block
              onClick={() => updatePasswordForm({ ...passwordForm, submitted: true, error: false })}
            >
              Update Password
            </Button>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};
