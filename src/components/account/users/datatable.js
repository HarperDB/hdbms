import React, { useState } from 'react';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';
import ReactTable from 'react-table';

import defaultTableState from '../../../state/defaults/defaultTableState';

export default ({ tableData }) => {
  const [tableState, setTableState] = useState({ ...defaultTableState, sorted: [{ id: 'lastname', desc: false }] });

  return (
    <>
      <Row>
        <Col className="text-nowrap">
          <span className="text-white">existing users</span>
        </Col>
        <Col className="text-right text-white text-nowrap">
          <i title="Filter Users" className="fa fa-search mr-3" onClick={() => setTableState({ ...tableState, filtered: tableState.showFilter ? [] : tableState.filtered, showFilter: !tableState.showFilter })} />
        </Col>
      </Row>
      <Card className="my-3">
        <CardBody>
          <ReactTable
            data={tableData.data}
            columns={tableData.columns}
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
          />
        </CardBody>
      </Card>
    </>
  );
};
