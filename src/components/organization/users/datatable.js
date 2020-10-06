import React, { useState, useCallback } from 'react';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import ReactTable from 'react-table-6';
import { useStoreState } from 'pullstate';
import { useHistory, useParams } from 'react-router';
import { useAlert } from 'react-alert';
import { ErrorBoundary } from 'react-error-boundary';

import appState from '../../../functions/state/appState';
import customerUserColumns from '../../../functions/datatable/customerUserColumns';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../functions/api/lms/addError';

export default () => {
  const { customer_id } = useParams();
  const alert = useAlert();
  const history = useHistory();
  const auth = useStoreState(appState, (s) => s.auth);
  const users = useStoreState(appState, (s) => s.users && s.users.filter((u) => u.user_id !== s.auth?.user_id));
  const [tableState, setTableState] = useState({
    filtered: [],
    page: 0,
    loading: true,
    tableData: [],
    pages: -1,
    totalRecords: 0,
    pageSize: 20,
    autoRefresh: false,
    showFilter: false,
    lastUpdate: false,
    sorted: [{ id: 'lastname', desc: false }],
  });

  const rowClick = useCallback(
    (user_id) => {
      if (auth.user_id === user_id) {
        alert.error('Edit your own profile by clicking the user icon in the top nav');
      } else {
        history.push(`/o/${customer_id}/users/${user_id}`);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [auth.user_id, customer_id]
  );

  return (
    <>
      <Row className="floating-card-header">
        <Col>existing users</Col>
        <Col className="text-right">
          <Button
            color="link"
            tabIndex="0"
            title="Filter Users"
            className="mr-3"
            onClick={() => setTableState({ ...tableState, filtered: tableState.showFilter ? [] : tableState.filtered, showFilter: !tableState.showFilter })}
          >
            <i className="fa fa-search" />
          </Button>
        </Col>
      </Row>
      <Card className="my-3">
        <CardBody>
          <ErrorBoundary onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id })} FallbackComponent={ErrorFallback}>
            <ReactTable
              data={users ? [auth, ...users] : [auth]}
              columns={customerUserColumns({ current_user_id: auth.user_id, current_org_id: customer_id })}
              pages={tableState.pages}
              onFilteredChange={(value) => setTableState({ ...tableState, filtered: value })}
              filtered={tableState.filtered}
              onSortedChange={(value) => setTableState({ ...tableState, sorted: value })}
              sorted={tableState.sorted}
              onPageChange={(value) => setTableState({ ...tableState, page: value })}
              page={tableState.page}
              filterable={tableState.showFilter}
              defaultPageSize={tableState.pageSize}
              pageSize={tableState.pageSize}
              onPageSizeChange={(value) => setTableState({ ...tableState, pageSize: value })}
              resizable={false}
              getTrProps={(state, rowInfo) => ({
                onClick: () => rowClick(rowInfo.original.user_id),
              })}
            />
          </ErrorBoundary>
        </CardBody>
      </Card>
    </>
  );
};
