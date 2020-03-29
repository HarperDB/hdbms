import React, { useState } from 'react';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';
import ReactTable from 'react-table';
import useAsyncEffect from 'use-async-effect';
import { useAlert } from 'react-alert';
import { useStoreState } from 'pullstate';

import appState from '../../../state/stores/appState';
import defaultTableState from '../../../util/datatable/defaultTableState';

import customerUserColumns from '../../../util/datatable/customerUserColumns';
import getUsers from '../../../api/lms/getUsers';
import removeUser from '../../../api/lms/removeUser';

export default ({ lastUpdate, setLastUpdate }) => {
  const lmsAuth = useStoreState(appState, (s) => s.auth);
  const alert = useAlert();
  const users = useStoreState(appState, (s) => s.users);
  const [tableState, setTableState] = useState({ ...defaultTableState, sorted: [{ id: 'lastname', desc: false }] });
  const [userToRemove, setUserToRemove] = useState(false);

  useAsyncEffect(async () => {
    getUsers({ auth: lmsAuth, payload: { customer_id: lmsAuth.customer_id } });
  }, [lastUpdate, lmsAuth.customer_id]);

  useAsyncEffect(async () => {
    if (userToRemove && userToRemove !== lmsAuth.user_id) {
      const response = await removeUser({ auth: lmsAuth, payload: { user_id: userToRemove, customer_id: lmsAuth.customer_id } });
      if (response.result === false) {
        alert.error(response.message);
      } else {
        setLastUpdate(Date.now());
      }
      setUserToRemove(false);
    }
  }, [userToRemove]);

  return (
    <>
      <Row>
        <Col className="text-nowrap">
          <span className="text-white mb-2 floating-card-header">existing users</span>
        </Col>
        <Col className="text-right text-white text-nowrap">
          <i title="Filter Users" className="fa fa-search floating-card-header" onClick={() => setTableState({ ...tableState, filtered: tableState.showFilter ? [] : tableState.filtered, showFilter: !tableState.showFilter })} />
        </Col>
      </Row>
      <Card className="my-3">
        <CardBody>
          <ReactTable
            data={users || []}
            columns={customerUserColumns({ setUserToRemove, userToRemove, current_user_id: lmsAuth.user_id })}
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
