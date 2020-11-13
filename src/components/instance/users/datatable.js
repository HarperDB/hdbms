import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import { useStoreState } from 'pullstate';
import { useHistory, useParams } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';

import instanceState from '../../../functions/state/instanceState';

import listUsers from '../../../functions/api/instance/listUsers';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../functions/api/lms/addError';
import DataTable from '../../shared/dataTable';

const defaultTableState = {
  tableData: false,
  totalRecords: 0,
  dataTableColumns: [],
  filtered: [],
  sorted: [{ id: 'username', desc: false }],
  page: 0,
  loading: false,
  totalPages: 1,
  pageSize: 20,
  autoRefresh: false,
  showFilter: false,
  lastUpdate: false,
};

const Datatable = () => {
  const { compute_stack_id, customer_id } = useParams();
  const history = useHistory();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const users = useStoreState(instanceState, (s) => s.users, [compute_stack_id]);
  const [tableState, setTableState] = useState(defaultTableState);
  const sortParam = tableState.sorted[0]?.id;
  const sortDesc = tableState.sorted[0]?.desc;

  const fetchUsers = useCallback(async () => {
    setTableState({ ...tableState, loading: true });
    await listUsers({ auth, url, is_local, compute_stack_id, customer_id });
    setTableState({ ...tableState, loading: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, url, is_local, compute_stack_id, customer_id]);

  const rowClick = useCallback(
    (user_id) => {
      history.push(`/o/${customer_id}/i/${compute_stack_id}/users/${user_id}`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [compute_stack_id, customer_id]
  );

  useEffect(() => {
    if (tableState.tableData.length && sortParam) {
      const userData = [...tableState.tableData];
      const sortedTableData = [...userData].sort((a, b) => (a[sortParam] > b[sortParam] && sortDesc ? 1 : a[sortParam] > b[sortParam] ? -1 : sortDesc ? -1 : 1));
      setTableState({ ...tableState, tableData: sortedTableData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortParam, sortDesc]);

  useEffect(() => {
    if (users) {
      setTableState({
        ...tableState,
        tableData: users,
        dataTableColumns: [
          { Header: 'username', accessor: 'username' },
          { Header: 'role', accessor: 'role' },
        ],
        totalPages: Math.ceil((users.length || tableState.pageSize) / tableState.pageSize),
        loading: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, setTableState, tableState.pageSize]);

  useEffect(fetchUsers, [fetchUsers]);

  return (
    <ErrorBoundary
      onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
      FallbackComponent={ErrorFallback}
    >
      <Row className="floating-card-header">
        <Col>existing users</Col>
        <Col className="text-right">
          <Button color="link" onClick={fetchUsers} className="mr-2">
            <i title="Refresh Structure" className={`fa ${tableState.loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`} />
          </Button>
          <span className="mx-3 text">|</span>
          <Button
            color="link"
            title="Filter Users"
            className="mr-2"
            onClick={() => setTableState({ ...tableState, filtered: tableState.showFilter ? [] : tableState.filtered, showFilter: !tableState.showFilter })}
          >
            <i className="fa fa-search" />
          </Button>
        </Col>
      </Row>
      <Card className="mt-3">
        <CardBody className="react-table-holder">
          <DataTable
            columns={tableState.dataTableColumns}
            data={tableState.tableData}
            currentPage={tableState.page}
            pageSize={tableState.pageSize}
            totalPages={tableState.totalPages}
            showFilter={tableState.showFilter}
            sorted={tableState.sorted}
            loading={tableState.loading && !tableState.autoRefresh}
            onFilteredChange={(value) => setTableState({ ...tableState, filtered: value })}
            onSortedChange={(value) => setTableState({ ...tableState, sorted: value })}
            onPageChange={(value) => setTableState({ ...tableState, pageSize: value })}
            onPageSizeChange={(value) => setTableState({ ...tableState, page: 0, pageSize: value })}
            onRowClick={(rowData) => rowClick(rowData.username)}
          />
        </CardBody>
      </Card>
    </ErrorBoundary>
  );
};

export default Datatable;
