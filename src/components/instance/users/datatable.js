import React, { useState } from 'react';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import ReactTable from 'react-table-6';
import { useStoreState } from 'pullstate';
import { useHistory, useParams } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';

import instanceState from '../../../functions/state/instanceState';

import instanceUserColumns from '../../../functions/datatable/instanceUserColumns';
import StructureReloader from '../../shared/structureReloader';
import ErrorFallback from '../../shared/errorFallback';
import addError from '../../../functions/api/lms/addError';

export default () => {
  const history = useHistory();
  const { compute_stack_id, customer_id } = useParams();
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
    sorted: [{ id: 'username', desc: false }],
  });
  const users = useStoreState(instanceState, (s) => s.users, [compute_stack_id]);
  const [tableColumns] = useState(instanceUserColumns());

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
          <ReactTable
            data={users}
            columns={tableColumns}
            onFilteredChange={(value) => setTableState({ ...tableState, filtered: value })}
            filtered={tableState.filtered}
            onSortedChange={(value) => setTableState({ ...tableState, sorted: value })}
            sorted={tableState.sorted}
            page={tableState.page}
            filterable={tableState.showFilter}
            defaultPageSize={tableState.pageSize}
            pageSize={tableState.pageSize}
            onPageSizeChange={(value) => setTableState({ ...tableState, pageSize: value })}
            resizable={false}
            getTrProps={(state, rowInfo) => ({
              onClick: () => history.push(`/o/${customer_id}/i/${compute_stack_id}/users/${rowInfo.original.username}`),
            })}
          />
        </CardBody>
      </Card>
    </ErrorBoundary>
  );
};
