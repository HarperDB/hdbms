import React, { useState } from 'react';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';
import ReactTable from 'react-table';
import useAsyncEffect from 'use-async-effect';
import { useAlert } from 'react-alert';

import defaultTableState from '../../../state/defaults/defaultTableState';
import customerUserColumns from '../../../util/datatable/customerUserColumns';
import getUsers from '../../../api/lms/getUsers';
import removeUser from '../../../api/lms/removeUser';
import useLMS from '../../../state/stores/lmsAuth';
import defaultLMSAuth from '../../../state/defaults/defaultLMSAuth';

export default ({ lastUpdate, setLastUpdate }) => {
  const alert = useAlert();
  const [lmsAuth] = useLMS(defaultLMSAuth);
  const [tableState, setTableState] = useState({ ...defaultTableState, sorted: [{ id: 'lastname', desc: false }] });
  const [userToRemove, setUserToRemove] = useState(false);
  const [tableData, setTableData] = useState({ loading: false, data: [], columns: customerUserColumns({ setUserToRemove, userToRemove, current_user_id: lmsAuth.user_id }) });

  useAsyncEffect(() => {
    if (lmsAuth.user_id) {
      setTableData({ ...tableData, columns: customerUserColumns({ setUserToRemove, userToRemove, current_user_id: lmsAuth.user_id }) });
    }
  }, [lmsAuth.user_id]);

  useAsyncEffect(async () => {
    if (lmsAuth.customer_id) {
      setTableData({ ...tableData, loading: true });
      const response = await getUsers({ auth: lmsAuth, payload: { customer_id: lmsAuth.customer_id } });
      if (response.result === false) {
        alert.error(response.message);
        setTableData({ ...tableData, loading: false });
      } else {
        setTableData({ ...tableData, data: response, loading: false });
      }
    }
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
          <i title="Refresh Users" className={`floating-card-header fa  mr-3 ${tableData.loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`} onClick={() => setLastUpdate(Date.now())} />
          <i title="Filter Users" className="fa fa-search floating-card-header" onClick={() => setTableState({ ...tableState, filtered: tableState.showFilter ? [] : tableState.filtered, showFilter: !tableState.showFilter })} />
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
