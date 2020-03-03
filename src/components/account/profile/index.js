import React from 'react';
import { Row, Col, Card, CardBody } from '@nio/ui-kit';

import ProfileForm from './profile';
import PasswordForm from './password';

export default () => (
  <Row>
    <Col md="6" className="mb-4">
      <span className="text-white mb-2 floating-card-header">profile</span>
      <Card className="my-3">
        <CardBody>
          <ProfileForm />
        </CardBody>
      </Card>
    </Col>
    <Col md="6" className="mb-4">
      <span className="text-white mb-2 floating-card-header">password</span>
      <Card className="my-3">
        <CardBody>
          <PasswordForm />
        </CardBody>
      </Card>
    </Col>
  </Row>
);
