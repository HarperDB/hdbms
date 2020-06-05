import React, { useEffect, useCallback } from 'react';
import { Row, Col, Card, CardBody } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';
import { useParams } from 'react-router-dom';

import appState from '../../../state/appState';
import DataTable from './datatable';
import EditUser from './edit';
import AddUserForm from './add';
import getUsers from '../../../api/lms/getUsers';
import config from '../../../../config';

export default () => {
  const { user_id } = useParams();
  const { auth, customer, users } = useStoreState(appState, (s) => ({ auth: s.auth, customer: s.customer, users: s.users }));
  const thisUser = user_id && users && users.find((u) => u.user_id === user_id);

  const refreshUsers = useCallback(() => {
    if (auth && customer.customer_id) {
      getUsers({ auth, customer_id: customer.customer_id });
    }
  }, [auth, customer.customer_id]);

  useEffect(() => refreshUsers(), []);

  useInterval(() => refreshUsers(), config.instances_refresh_rate);

  return (
    <Row>
      <Col xl="3" lg="4" md="5" xs="12">
        <span className="floating-card-header">add user</span>
        <Card className="my-3">
          <CardBody>
            <AddUserForm refreshUsers={refreshUsers} userEmails={users && users.map((u) => u.orgs[0].status !== 'declined' && u)} />
          </CardBody>
        </Card>
      </Col>
      <Col xl="9" lg="8" md="7" xs="12" className="pb-5">
        {thisUser ? <EditUser userEmail={thisUser.email} /> : <DataTable refreshUsers={refreshUsers} />}
      </Col>
    </Row>
  );
};
