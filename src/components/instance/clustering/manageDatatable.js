import React, { useState } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { useStoreState } from 'pullstate';

import instanceState from '../../../functions/state/instanceState';
import StructureReloader from '../../shared/structureReloader';
import DataTable from '../../shared/dataTable';

const ManageDatatable = () => {
  const data = useStoreState(instanceState, (s) => s.clusterDataTable);
  const columns = useStoreState(instanceState, (s) => s.clusterDataTableColumns);
  const [tableState, setTableState] = useState({
    filtered: [],
    sorted: [],
    page: 0,
    loading: false,
    totalPages: Math.ceil((data?.length || 20) / 20),
    totalRecords: 0,
    pageSize: 20,
    autoRefresh: false,
    showFilter: false,
    lastUpdate: false,
  });

  return (
    <>
      <Row className="floating-card-header">
        <Col>manage clustering</Col>
        <Col className="text-right">
          <StructureReloader label="refresh cluster config" />
        </Col>
      </Row>
      <Card className="my-3">
        <CardBody className="react-table-holder">
          <DataTable
            columns={columns}
            data={data}
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
          />
        </CardBody>
      </Card>
    </>
  );
};

export default ManageDatatable;
