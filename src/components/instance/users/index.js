import React from 'react';
import { Row, Col } from '@nio/ui-kit';

import DataTable from './datatable';
import AddUserForm from './add';

export default () => (
  <Row>
    <Col xl="3" lg="4" md="5" xs="12">
      <AddUserForm />
    </Col>
    <Col xl="9" lg="8" md="7" xs="12" className="pb-5">
      <DataTable />
    </Col>
  </Row>
);
