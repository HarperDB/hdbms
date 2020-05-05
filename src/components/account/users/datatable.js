import React, { useState } from 'react';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';
import ReactTable from 'react-table';
import useAsyncEffect from 'use-async-effect';
import { useAlert } from 'react-alert';
import { useStoreState } from 'pullstate';

import appState from '../../../state/appState';
import customerUserColumns from '../../../methods/datatable/customerUserColumns';
import getUsers from '../../../api/lms/getUsers';
import removeUser from '../../../api/lms/removeUser';

export default ({ lastUpdate, setLastUpdate }) => {
  const auth = useStoreState(appState, (s) => s.auth);
  const customer = useStoreState(appState, (s) => s.customer);
  const alert = useAlert();
  const users = useStoreState(appState, (s) => s.users);
  const [tableState, setTableState] = useState({
    filtered: [],
    page: 0,
    loading: true,
    tableData: [],
    pages: -1,
    totalRecords: 0,
    pageSize: 20,
    autoRefresh: false,
    showFilter: false,
    lastUpdate: false,
    sorted: [{ id: 'lastname', desc: false }],
  });
  const [userToRemove, setUserToRemove] = useState(false);

  useAsyncEffect(async () => {
    getUsers({ auth, customer_id: customer.customer_id });
  }, [lastUpdate, auth.customer_id]);

  useAsyncEffect(async () => {
    if (userToRemove && userToRemove !== auth.user_id) {
      const response = await removeUser({ auth, user_id: userToRemove, customer_id: customer.customer_id });
      if (response.error) {
        alert.error(response.message);
      } else {
        setLastUpdate(Date.now());
      }
      setUserToRemove(false);
    }
  }, [userToRemove]);

  return (
    <>
      <Row className="floating-card-header">
        <Col>existing users</Col>
        <Col className="text-right">
          <i
            title="Filter Users"
            className="fa fa-search "
            onClick={() => setTableState({ ...tableState, filtered: tableState.showFilter ? [] : tableState.filtered, showFilter: !tableState.showFilter })}
          />
        </Col>
      </Row>
      <Card className="my-3">
        <CardBody>
          <ReactTable
            data={users || []}
            columns={customerUserColumns({ setUserToRemove, userToRemove, current_user_id: auth.user_id })}
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
