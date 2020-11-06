import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import { useStoreState } from 'pullstate';
import { useHistory, useParams } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';

import instanceState from '../../../functions/state/instanceState';

import instanceUserColumns from '../../../functions/datatable/instanceUserColumns';
import StructureReloader from '../../shared/structureReloader';
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
  const history = useHistory();
  const { compute_stack_id, customer_id } = useParams();
  const [tableColumns] = useState(instanceUserColumns());
  const [tableState, setTableState] = useState(defaultTableState);
  const sortParam = tableState.sorted[0]?.id;
  const sortDesc = tableState.sorted[0]?.desc;
  const users = useStoreState(instanceState, (s) => s.users, [compute_stack_id]);

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
      const sortedTableData = userData.sort((a, b) => (a[sortParam] > b[sortParam] && sortDesc ? 1 : a[sortParam] > b[sortParam] ? -1 : sortDesc ? -1 : 1));
      setTableState({ ...tableState, tableData: sortedTableData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortParam, sortDesc]);

  useEffect(() => {
    if (users && tableColumns) {
      setTableState({
        ...tableState,
        tableData: users,
        dataTableColumns: tableColumns,
        totalPages: Math.ceil((users.length || tableState.pageSize) / tableState.pageSize),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, tableColumns, setTableState, tableState.pageSize]);

  return (
    <ErrorBoundary
      onError={(error, componentStack) => addError({ error: { message: error.message, componentStack }, customer_id, compute_stack_id })}
      FallbackComponent={ErrorFallback}
    >
      <Row className="floating-card-header">
        <Col>existing users</Col>
        <Col className="text-right">
          <StructureReloader label="refresh users" />
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
      <Card className="my-3">
        <CardBody>
          <DataTable
            columns={tableState.dataTableColumns}
            data={tableState.tableData}
            page={tableState.page}
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
