import React from 'react';
import { CardBody, Card } from 'reactstrap';

import StructureReloader from '../../shared/structureReloader';

const EmptyPrompt = ({ message }) => (
  <>
    <div className="floating-card-header text-right">
      <StructureReloader label="refresh schemas and tables" />
    </div>
    <Card className="my-3">
      <CardBody>
        <div className="empty-prompt">{message}</div>
      </CardBody>
    </Card>
  </>
);

export default EmptyPrompt;
