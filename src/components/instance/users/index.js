import React from 'react';
import { Row, Col, Card, CardBody } from '@nio/ui-kit';
import { useParams } from 'react-router-dom';

import DataTable from './datatable';
import AddUserForm from './add';
import EditUser from './edit';

export default () => {
  const { username } = useParams();
  return (
    <Row>
      <Col xl="3" lg="4" md="5" xs="12">
        <span className="floating-card-header">add user</span>
        <Card className="my-3">
          <CardBody>
            <AddUserForm />
          </CardBody>
        </Card>
      </Col>
      <Col xl="9" lg="8" md="7" xs="12" className="pb-5">
        {username ? <EditUser /> : <DataTable />}
      </Col>
    </Row>
  );
};
