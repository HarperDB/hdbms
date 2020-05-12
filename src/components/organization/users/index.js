import React, { useEffect, useCallback } from 'react';
import { Row, Col, Card, CardBody } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';

import DataTable from './datatable';
import AddUserForm from './add';
import appState from '../../../state/appState';
import getUsers from '../../../api/lms/getUsers';
import config from '../../../../config';

export default () => {
  const { auth, customer, users } = useStoreState(appState, (s) => ({ auth: s.auth, customer: s.customer, users: s.users }));

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
        <DataTable refreshUsers={refreshUsers} />
      </Col>
    </Row>
  );
};
