import React from 'react';
import { CardBody, Card } from 'reactstrap';

function EmptyPrompt({ headline, description, icon }) {
  return <>
    <div className="floating-card-header text-end">&nbsp;</div>
    <Card className="my-3">
      <CardBody>
        <div className="empty-prompt narrow">
          {icon}
          {headline && <div className="mt-3">{headline}</div>}
          <div className="mt-3">{description}</div>
        </div>
      </CardBody>
    </Card>
  </>
}

export default EmptyPrompt;
