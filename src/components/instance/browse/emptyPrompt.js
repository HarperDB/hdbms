import React from 'react';
import { CardBody, Card } from 'reactstrap';

import StructureReloader from '../../shared/structureReloader';

const EmptyPrompt = ({ message }) => (
  <>
    <div className="floating-card-header text-right">
      <StructureReloader label="refresh schemas and tables" />
    </div>
    <Card className="my-3">
      <CardBody className="py-5">
        <div className="text-center">{message}</div>
      </CardBody>
    </Card>
  </>
);

export default EmptyPrompt;
