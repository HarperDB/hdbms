import React, { useState } from 'react';
import ReactTable from 'react-table-6';
import { Card, CardBody, Col, Row, Button } from 'reactstrap';
import { useStoreState } from 'pullstate';

import instanceState from '../../../functions/state/instanceState';
import StructureReloader from '../../shared/structureReloader';

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
  const clusterDataTable = useStoreState(instanceState, (s) => s.clusterDataTable);
  const clusterDataTableColumns = useStoreState(instanceState, (s) => s.clusterDataTableColumns);

  return (
    <>
      <Row className="floating-card-header">
        <Col>manage clustering</Col>
        <Col className="text-right">
          <StructureReloader label="refresh cluster config" />
          <span className="mx-3 text">|</span>
          <Button
            color="link"
            title="Filter Instances"
            className=" mr-2"
            onClick={() => setTableState({ ...tableState, filtered: tableState.showFilter ? [] : tableState.filtered, showFilter: !tableState.showFilter })}
          >
            <i className="fa fa-search" />
          </Button>
        </Col>
      </Row>
      <Card className="my-3">
        <CardBody>
          <ReactTable
            data={clusterDataTable}
            columns={clusterDataTableColumns}
            onFilteredChange={(value) => setTableState({ ...tableState, filtered: value })}
            filtered={tableState.filtered}
            sortable={false}
            filterable={tableState.showFilter}
            defaultPageSize={tableState.pageSize}
            pageSize={tableState.pageSize}
            onPageSizeChange={(value) => setTableState({ ...tableState, pageSize: value })}
            resizable={false}
          />
        </CardBody>
      </Card>
    </>
  );
};
