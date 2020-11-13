import React from 'react';
import { Button, Card, CardBody } from 'reactstrap';

const ErrorFallback = ({ error, componentStack, extraClass = undefined }) => (
  <Card className={`error-boundary mb-3 ${extraClass}`}>
    <CardBody>
      <b>Component Error {new Date().toLocaleTimeString()}</b>
      <hr className="my-1" />
      <div className="error-message">{error.message}</div>
      <hr className="my-1" />
      <div className="stack-trace">
        <pre>{componentStack}</pre>
      </div>
      <Button color="danger" block href="https://harperdbhelp.zendesk.com/hc/en-us/requests/new" target="_blank" rel="noopener noreferrer">
        Create A Support Ticket
      </Button>
    </CardBody>
  </Card>
);

export default ErrorFallback;
