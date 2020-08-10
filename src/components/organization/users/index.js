import React, { useEffect, useCallback } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useStoreState } from 'pullstate';
import useInterval from 'use-interval';
import { useParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../../../state/appState';
import DataTable from './datatable';
import EditUser from './edit';
import AddUserForm from './add';
import getUsers from '../../../api/lms/getUsers';
import config from '../../../config';
import addError from '../../../api/lms/addError';
import ErrorFallback from '../../shared/errorFallback';

export default () => {
  const { user_id, customer_id } = useParams();
  const auth = useStoreState(appState, (s) => s.auth);
  const users = useStoreState(appState, (s) => s.users);
  const thisUser = user_id && users && users.find((u) => u.user_id === user_id);

  const refreshUsers = useCallback(() => {
    if (auth && customer_id) {
      getUsers({ auth, customer_id });
    }
  }, [auth, customer_id]);

  useEffect(
    () => refreshUsers(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useInterval(() => refreshUsers(), config.refresh_content_interval);

  return (
    <Row>
      <Col xl="3" lg="4" md="5" xs="12">
        <span className="floating-card-header">add user</span>
        <Card className="my-3">
          <CardBody>
            <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id })} FallbackComponent={ErrorFallback}>
              <AddUserForm refreshUsers={refreshUsers} userEmails={users && users.map((u) => u.orgs[0].status !== 'declined' && u)} />
            </ErrorBoundary>
          </CardBody>
        </Card>
      </Col>
      <Col xl="9" lg="8" md="7" xs="12" className="pb-5">
        {thisUser ? <EditUser userEmail={thisUser.email} /> : <DataTable refreshUsers={refreshUsers} />}
      </Col>
    </Row>
  );
};
