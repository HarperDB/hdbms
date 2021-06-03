import React from 'react';
import { CardBody, Card, Button } from 'reactstrap';

const EmptyPrompt = ({ headline, description, icon, refreshCustomFunctions }) => (
  <>
    <div className="floating-card-header text-right">
      <Button color="link" onClick={refreshCustomFunctions} className="mr-2">
        <span className="mr-2">refresh endpoints</span>
        <i title="Refresh Roles" className="fa fa-refresh" />
      </Button>
    </div>
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
);

export default EmptyPrompt;
