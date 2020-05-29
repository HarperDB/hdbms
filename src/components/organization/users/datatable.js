import React, { useState } from 'react';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';
import ReactTable from 'react-table';
import { useStoreState } from 'pullstate';
import { useHistory } from 'react-router';

import appState from '../../../state/appState';
import customerUserColumns from '../../../methods/datatable/customerUserColumns';

export default () => {
  const history = useHistory();
  const auth = useStoreState(appState, (s) => s.auth);
  const customer = useStoreState(appState, (s) => s.customer);
  const users = useStoreState(appState, (s) => s.users && s.users.filter((u) => u.user_id !== auth.user_id));
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

  return (
    <>
      <Row className="floating-card-header">
        <Col>existing users</Col>
        <Col className="text-right">
          <i
            title="Filter Users"
            className="fa fa-search "
            onClick={() => setTableState({ ...tableState, filtered: tableState.showFilter ? [] : tableState.filtered, showFilter: !tableState.showFilter })}
          />
        </Col>
      </Row>
      <Card className="my-3">
        <CardBody>
          <ReactTable
            data={users || []}
            columns={customerUserColumns({ current_user_id: auth.user_id })}
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
              onClick: () => history.push(`/${customer.customer_id}/users/${rowInfo.original.user_id}`),
            })}
          />
        </CardBody>
      </Card>
    </>
  );
};
