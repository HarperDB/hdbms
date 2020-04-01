import React, { useState } from 'react';
import ReactTable from 'react-table';
import { Card, CardBody, Col, Row } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';
import useAsyncEffect from 'use-async-effect';

import defaultTableState from '../../../util/datatable/defaultTableState';
import clusterConfigColumns from '../../../util/datatable/clusterConfigColumns';
import buildClusteringTable from '../../../util/instance/buildClusteringTable';
import instanceState from '../../../state/stores/instanceState';

export default ({ instances }) => {
  const [tableState, setTableState] = useState(defaultTableState);
  const [tableData, setTableData] = useState([]);
  const { auth, url, structure } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
    structure: s.structure,
  }));
  const columns = clusterConfigColumns({
    auth,
    url,
  });

  useAsyncEffect(
    () =>
      setTableData(
        buildClusteringTable({
          structure,
          instances,
        })
      ),
    [structure, instances]
  );

  return (
    <>
      <Row>
        <Col className="text-nowrap">
          <span className="text-white">
            <span>manage clustering</span>
          </span>
        </Col>
        <Col className="text-right text-white">
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
            data={tableData}
            columns={columns}
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
