import React from 'react';
import { Row, Col, Card, CardBody } from '@nio/ui-kit';

import ProfileForm from './profile_profile';
import PasswordForm from './profile_password';

export default () => (
  <Row>
    <Col md="6" className="mb-4">
      <span className="text-white mb-2">profile</span>
      <Card className="my-3">
        <CardBody>
          <ProfileForm />
        </CardBody>
      </Card>
    </Col>
    <Col md="6" className="mb-4">
      <span className="text-white mb-2">password</span>
      <Card className="my-3">
        <CardBody>
          <PasswordForm />
        </CardBody>
      </Card>
    </Col>
  </Row>
);
