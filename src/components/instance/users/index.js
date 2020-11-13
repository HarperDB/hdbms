import React, { lazy, Suspense } from 'react';
import { Row, Col } from 'reactstrap';
import { useParams } from 'react-router-dom';

import AddUserForm from './Add';
import Loader from '../../shared/Loader';

const DataTable = lazy(() => import(/* webpackChunkName: "instance-users-datatable" */ './Datatable'));
const EditUser = lazy(() => import(/* webpackChunkName: "instance-users-edit" */ './Edit'));

const UsersIndex = () => {
  const { username } = useParams();

  return (
    <Row>
      <Col xl="3" lg="4" md="5" xs="12">
        <AddUserForm />
      </Col>
      <Col xl="9" lg="8" md="7" xs="12" className="pb-5">
        <Suspense fallback={<Loader header=" " spinner />}>{username ? <EditUser /> : <DataTable />}</Suspense>
      </Col>
    </Row>
  );
};

export default UsersIndex;
