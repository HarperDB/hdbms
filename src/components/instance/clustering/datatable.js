import React, { useEffect, useState } from 'react';
import ReactTable from 'react-table';
import { Card, CardBody, Col, Row } from '@nio/ui-kit';

import defaultTableState from '../../../state/defaults/defaultTableState';
import clusterConfigColumns from '../../../util/datatable/clusterConfigColumns';

export default ({ instances, network, schema, table, auth, refreshInstance }) => {
  const [tableState, setTableState] = useState(defaultTableState);
  const [tableData, setTableData] = useState({ data: [], columns: clusterConfigColumns({ auth, refreshInstance }) });

  useEffect(() => {
    if (table) {
      const newTableData = instances.map((i) => {
        const connection = network && network.outbound_connections.find((n) => n.name === i.id);
        const subscriptions = schema && table && connection && connection.subscriptions ? connection.subscriptions : [];
        const channel = schema && table && `${schema}:${table}`;
        const channelSubscription = channel && subscriptions.find((s) => s.channel === channel);
        const publish = channelSubscription && channelSubscription.publish;
        const subscribe = channelSubscription && channelSubscription.subscribe;
        const clusterPort = 12345;
        const { id, instance_name, is_ssl, host, port } = i;
        const url = `http${is_ssl ? 's' : ''}://${host}:${port}`;
        return { id, instance_name, is_ssl, host, port, url, clusterPort, publish, subscribe, connection, channel, subscriptions };
      });
      setTableData({ ...tableData, data: newTableData });
      setTableState({ ...tableState, filtered: [], sorted: [{ id: 'instance_name', desc: false }], page: 0 });
    }
  }, [table]);

  return (
    <>
      <Row>
        <Col className="text-nowrap">
          <span className="text-white">
            <span>{schema}&nbsp;&gt;&nbsp;{table}</span>
          </span>
        </Col>
        <Col className="text-right text-white">
          <i title={`Filter table ${table}`} className="fa fa-search mr-3" onClick={() => setTableState({ ...tableState, filtered: tableState.showFilter ? [] : tableState.filtered, showFilter: !tableState.showFilter })} />
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
