import React from 'react';
import { CardBody, Card } from '@nio/ui-kit';

export default ({ message, error = false }) => (
  <>
    <div className="floating-card-header">&nbsp;</div>
    <Card className="my-3 py-5">
      <CardBody>
        <div className={`text-center ${error ? 'text-danger' : ''}`}>{message}</div>
      </CardBody>
    </Card>
  </>
);
