import React from 'react';
import { Card, CardBody } from '@nio/ui-kit';

export default ({ message }) => (
  <div className="loader">
    <Card>
      <CardBody className="text-white text-center">
        <div className="mb-3">{message.toLowerCase()}</div>
        <i className="fa fa-spinner fa-spin text-white" />
      </CardBody>
    </Card>
  </div>
);
