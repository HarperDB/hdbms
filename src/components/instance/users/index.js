import React, { lazy, Suspense } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useParams } from 'react-router-dom';

import AddUserForm from './add';
import Loader from '../../shared/loader';

const DataTable = lazy(() => import('./datatable'));
const EditUser = lazy(() => import('./edit'));

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
        <Suspense fallback={<Loader header=" " spinner />}>{username ? <EditUser /> : <DataTable />}</Suspense>
      </Col>
    </Row>
  );
};
