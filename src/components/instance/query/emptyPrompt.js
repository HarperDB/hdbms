import React from 'react';
import { CardBody, Card } from '@nio/ui-kit';

export default ({ message }) => (
  <>
    <div className="text-white floating-card-header text-right">&nbsp;</div>
    <Card className="my-3 py-5">
      <CardBody>
        <div className="text-center">{message}</div>
      </CardBody>
    </Card>
  </>
);
