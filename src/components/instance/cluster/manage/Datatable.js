import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import { useStoreState } from 'pullstate';

import instanceState from '../../../../functions/state/instanceState';
import DataTable from '../../../shared/DataTable';

const defaultTableState = {
  filtered: [],
  sorted: [],
  page: 0,
  totalPages: 1,
  pageSize: 20,
  autoRefresh: false,
  showFilter: false,
  lastUpdate: false,
};

const Datatable = ({ refreshNetwork, loading }) => {
  const tableData = useStoreState(instanceState, (s) => s.clusterDataTable);
  const dataTableColumns = useStoreState(instanceState, (s) => s.clusterDataTableColumns);
  const [tableState, setTableState] = useState(defaultTableState);

  useEffect(() => {
    setTableState({
      ...tableState,
      totalPages: Math.ceil((tableData.length || tableState.pageSize) / tableState.pageSize),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTableState, tableState.pageSize]);

  return (
    <>
      <Row className="floating-card-header">
        <Col>manage clustering</Col>
        <Col className="text-right">
          <Button color="link" onClick={refreshNetwork} className="mr-2">
            <span className="mr-2">refresh network</span>
            <i title="Refresh Roles" className={`fa ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`} />
          </Button>
        </Col>
      </Row>
      <Card className="my-3">
        <CardBody className={`react-table-holder ${loading ? 'loading' : ''}`}>
          {tableData.length ? (
            <DataTable
              columns={dataTableColumns}
              data={tableData}
              page={tableState.page}
              pageSize={tableState.pageSize}
              totalPages={tableState.totalPages}
              showFilter={tableState.showFilter}
              sorted={tableState.sorted}
              onFilteredChange={(value) => setTableState({ ...tableState, filtered: value })}
              onSortedChange={(value) => setTableState({ ...tableState, sorted: value })}
              onPageChange={(value) => setTableState({ ...tableState, pageSize: value })}
              onPageSizeChange={(value) => setTableState({ ...tableState, page: 0, pageSize: value })}
            />
          ) : (
            <div className="empty-prompt">Please connect at least one instance to configure clustering</div>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default Datatable;
