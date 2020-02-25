import React from 'react';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';

export default () => (
  <Row>
    <Col>
      <span className="text-white mb-2">users</span>
      <Card className="my-3">
        <CardBody>
          content here
        </CardBody>
      </Card>
    </Col>
  </Row>
);
