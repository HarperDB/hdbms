import React, { useState } from 'react';
import ReactTable from 'react-table';
import { Card, CardBody, Col, Row } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import instanceState from '../../../state/instanceState';

export default () => {
  const [tableState, setTableState] = useState({
    filtered: [],
    sorted: [],
    page: 0,
    loading: true,
    tableData: [],
    pages: -1,
    totalRecords: 0,
    pageSize: 20,
    autoRefresh: false,
    showFilter: false,
    lastUpdate: false,
  });
  const { clusterDataTable, clusterDataTableColumns, loading } = useStoreState(instanceState, (s) => ({
    clusterDataTable: s.clusterDataTable,
    clusterDataTableColumns: s.clusterDataTableColumns,
    loading: s.loading,
  }));

  return (
    <>
      <Row className="floating-card-header">
        <Col>manage clustering</Col>
        <Col className="text-right">
          <i
            title="Refresh instance schema and tables"
            className={`fa mr-2 ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`}
            onClick={() =>
              instanceState.update((s) => {
                s.lastUpdate = Date.now();
              })
            }
          />
          <span className="mx-3 text">|</span>
          <i
            title="Filter Instances"
            className="fa fa-search mr-3"
            onClick={() =>
              setTableState({
                ...tableState,
                filtered: tableState.showFilter ? [] : tableState.filtered,
                showFilter: !tableState.showFilter,
              })
            }
          />
        </Col>
      </Row>
      <Card className="my-3">
        <CardBody>
          <ReactTable
            data={clusterDataTable}
            columns={clusterDataTableColumns}
            onFilteredChange={(value) =>
              setTableState({
                ...tableState,
                filtered: value,
              })
            }
            filtered={tableState.filtered}
            sortable={false}
            filterable={tableState.showFilter}
            defaultPageSize={tableState.pageSize}
            pageSize={tableState.pageSize}
            onPageSizeChange={(value) =>
              setTableState({
                ...tableState,
                pageSize: value,
              })
            }
            resizable={false}
          />
        </CardBody>
      </Card>
    </>
  );
};
