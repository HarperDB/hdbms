import React from 'react';
import { Row, Col } from 'reactstrap';

import ProfileForm from './profile';
import PasswordForm from './password';

const ProfileIndex = () => (
  <Row>
    <Col md="6" className="mb-4">
      <span className="floating-card-header">profile</span>
      <ProfileForm />
    </Col>
    <Col md="6" className="mb-4">
      <span className="floating-card-header">password</span>
      <PasswordForm />
    </Col>
  </Row>
);

export default ProfileIndex;
