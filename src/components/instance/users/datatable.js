import React, { useState } from 'react';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';
import ReactTable from 'react-table';
import { useStoreState } from 'pullstate';
import { useHistory, useParams } from 'react-router';

import instanceState from '../../../state/instanceState';

import instanceUserColumns from '../../../methods/datatable/instanceUserColumns';

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
  const users = useStoreState(instanceState, (s) => s.users);
  const [tableColumns] = useState(instanceUserColumns());

  return (
    <>
      <Row className="floating-card-header">
        <Col>existing users</Col>
        <Col className="text-right">
          <i
            title="Filter Users"
            className="fa fa-search mr-3"
            onClick={() => setTableState({ ...tableState, filtered: tableState.showFilter ? [] : tableState.filtered, showFilter: !tableState.showFilter })}
          />
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
              onClick: () => history.push(`/${customer_id}/instance/${compute_stack_id}/users/${rowInfo.original.username}`),
            })}
          />
        </CardBody>
      </Card>
    </>
  );
};
