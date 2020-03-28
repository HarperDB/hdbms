import React, { useEffect, useState } from 'react';
import ReactTable from 'react-table';
import { Card, CardBody, Col, Row } from '@nio/ui-kit';
import { useHistory } from 'react-router';

import defaultTableState from '../../../state/defaultTableState';
import clusterConfigColumns from '../../../util/datatable/clusterConfigColumns';
import instanceState from '../../../state/stores/instanceState';

export default ({ instances, network, schema, table, auth, url }) => {
  const history = useHistory();
  const [tableState, setTableState] = useState(defaultTableState);
  const [tableData, setTableData] = useState({
    data: [],
    columns: clusterConfigColumns({
      auth,
      url,
      refreshInstance: () => instanceState.update((s) => { s.lastUpdate = Date.now(); }),
      registerInstance: () => history.push('/instances/new'),
    }),
  });

  useEffect(() => {
    const registeredInstances = instances.map((i) => {
      const connection = network && network.outbound_connections.find((n) => n.name === i.instance_name);
      const subscriptions = schema && table && connection && connection.subscriptions ? connection.subscriptions : [];
      const channel = schema && table && `${schema}:${table}`;
      const channelSubscription = channel && subscriptions.find((s) => s.channel === channel);
      const publish = channelSubscription && channelSubscription.publish;
      const subscribe = channelSubscription && channelSubscription.subscribe;
      const clusterPort = 12345;
      const { instance_name, ip_address, is_local, host } = i;
      const instance_status = is_local ? 'OK' : i.status;
      const instance_host = host || ip_address;
      return { instance_name, instance_url: i.url, instance_status, instance_host, clusterPort, publish, subscribe, connection, channel, subscriptions, registered: true };
    });
    const unregisteredInstances = network.outbound_connections.filter((c) => !registeredInstances.find((r) => r.instance_host === c.host)).map((i) => ({
      instance_name: i.name,
      registered: false,
    }));

    setTableData({ ...tableData, data: [...registeredInstances, ...unregisteredInstances] });
    setTableState({ ...tableState, filtered: [], sorted: [{ id: 'instance_name', desc: false }], page: 0 });
  }, [table, network]);

  return (
    <>
      <Row>
        <Col className="text-nowrap">
          <span className="text-white">
            <span>manage clustering {schema && table && `for ${schema} > ${table}`}</span>
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
