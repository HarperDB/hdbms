import React from 'react';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';

export default () => (
  <Row>
    <Col>
      <span className="text-bold text-white mb-2">Enterprise</span>
      <Card className="mb-3 mt-2">
        <CardBody>
          content here
        </CardBody>
      </Card>
    </Col>
  </Row>
);
