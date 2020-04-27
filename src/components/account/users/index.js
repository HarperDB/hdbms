import React, { useState } from 'react';
import { Row, Col, Card, CardBody } from '@nio/ui-kit';

import DataTable from './datatable';
import AddUserForm from './add';

export default () => {
  const [lastUpdate, setLastUpdate] = useState(false);

  return (
    <Row>
      <Col xl="3" lg="4" md="5" xs="12">
        <span className="floating-card-header">add user</span>
        <Card className="my-3">
          <CardBody>
            <AddUserForm setLastUpdate={setLastUpdate} />
          </CardBody>
        </Card>
      </Col>
      <Col xl="9" lg="8" md="7" xs="12" className="pb-5">
        <DataTable lastUpdate={lastUpdate} setLastUpdate={setLastUpdate} />
      </Col>
    </Row>
  );
};
