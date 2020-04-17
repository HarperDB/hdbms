import { Card, CardBody } from '@nio/ui-kit';
import React from 'react';

export default ({ message }) => (
  <Card className="my-2">
    <CardBody className="px-2 py-3 text-small text-danger text-center">{message}</CardBody>
  </Card>
);
