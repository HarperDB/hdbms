import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import { useStoreState } from 'pullstate';

import instanceState from '../../../../functions/state/instanceState';

import DataTable from './datatable';

const ManageDatatable = ({ refreshNetwork, loading }) => {
  const compute_stack_id = useStoreState(instanceState, (s) => s.compute_stack_id);
  const tableData = useStoreState(instanceState, (s) => s.clusterDataTable, [compute_stack_id]);
  const dataTableColumns = useStoreState(instanceState, (s) => s.clusterDataTableColumns, [compute_stack_id]);
  const [tableState, setTableState] = useState({
    tableData: false,
    dataTableColumns: [],
    filtered: [],
    sorted: [],
    page: 0,
    totalPages: 1,
    pageSize: 20,
    autoRefresh: false,
    showFilter: false,
    lastUpdate: false,
  });

  useEffect(() => {
    if (tableData && dataTableColumns) {
      setTableState({
        ...tableState,
        tableData,
        dataTableColumns,
        totalPages: Math.ceil((tableData.length || tableState.pageSize) / tableState.pageSize),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData, dataTableColumns, setTableState, tableState.pageSize]);

  return (
    <>
      <Row className="floating-card-header">
        <Col>manage clustering</Col>
        <Col className="text-right">
          <Button color="link" onClick={() => refreshNetwork()} className="mr-2">
            <span className="mr-2">refresh network</span>
            <i title="Refresh Roles" className="fa fa-refresh" />
          </Button>
        </Col>
      </Row>
      <Card className="my-3">
        <CardBody className="react-table-holder">
          {tableState.tableData.length ? (
            <DataTable
              columns={tableState.dataTableColumns}
              data={tableState.tableData}
              page={tableState.page}
              pageSize={tableState.pageSize}
              totalPages={tableState.totalPages}
              showFilter={tableState.showFilter}
              sorted={tableState.sorted}
              loading={loading}
              onFilteredChange={(value) => setTableState({ ...tableState, filtered: value })}
              onSortedChange={(value) => setTableState({ ...tableState, sorted: value })}
              onPageChange={(value) => setTableState({ ...tableState, pageSize: value })}
              onPageSizeChange={(value) => setTableState({ ...tableState, page: 0, pageSize: value })}
              refreshNetwork={refreshNetwork}
            />
          ) : (
            <div className="empty-prompt">Please connect at least one instance to configure clustering</div>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default ManageDatatable;
