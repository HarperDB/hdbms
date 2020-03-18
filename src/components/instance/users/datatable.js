import React, { useEffect, useState } from 'react';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';
import ReactTable from 'react-table';
import { useStoreState } from 'pullstate';

import defaultTableState from '../../../state/defaultTableState';
import dropUser from '../../../api/instance/dropUser';
import instanceState from '../../../state/stores/instanceState';
import instanceUserColumns from '../../../util/datatable/instanceUserColumns';

export default () => {
  const [tableData, setTableData] = useState({ data: [], columns: [] });
  const [tableState, setTableState] = useState({ ...defaultTableState, sorted: [{ id: 'username', desc: false }] });
  const { auth, url, users } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
    users: s.users,
    roles: s.roles,
  }));

  const deleteUser = async ({ username }) => {
    const response = await dropUser({ auth, username, url });

    if (response.message.indexOf('successfully') !== -1) {
      alert.success(response.message);
      instanceState.update((s) => { s.lastUpdate = Date.now(); });
    } else {
      alert.error(response.message);
    }
  };

  useEffect(() => {
    if (users && auth) {
      setTableData({ data: users, columns: instanceUserColumns({ deleteUser }) });
    }
  }, [users, auth]);

  return (
    <>
      <Row>
        <Col className="text-nowrap">
          <span className="text-white mb-2 floating-card-header">existing users</span>
        </Col>
        <Col className="text-right text-white text-nowrap">
          <a onClick={() => setTableState({ ...tableState, filtered: tableState.showFilter ? [] : tableState.filtered, showFilter: !tableState.showFilter })}>
            <i title="Filter Users" className="fa fa-search mr-3 floating-card-header" />
          </a>
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
