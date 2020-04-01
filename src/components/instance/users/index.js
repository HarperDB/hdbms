import React from 'react';
import { Row, Col, Card, CardBody } from '@nio/ui-kit';

import DataTable from './datatable';
import AddUserForm from './add';

export default () => (
  <Row>
    <Col xl="3" lg="4" md="5" xs="12">
      <span className="text-white mb-2 floating-card-header">add user</span>
      <Card className="my-3">
        <CardBody>
          <AddUserForm />
        </CardBody>
      </Card>
    </Col>
    <Col xl="9" lg="8" md="7" xs="12" className="pb-5">
      <DataTable />
    </Col>
  </Row>
);
