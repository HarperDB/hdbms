import React, { useState } from 'react';
import { Card, CardBody, Row, Col } from '@nio/ui-kit';
import ReactTable from 'react-table';
import { useStoreState } from 'pullstate';

import instanceState from '../../../state/instanceState';

import instanceUserColumns from '../../../methods/datatable/instanceUserColumns';
import ModalPassword from './modalPassword';
import ModalRole from './modalRole';
import ModalDelete from './modalDelete';

export default () => {
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
    sorted: [{ id: 'username', desc: false }],
  });
  const [modal, setModal] = useState(false);
  const { auth, users } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    users: s.users,
  }));
  const [tableColumns] = useState(instanceUserColumns({ auth, setModal }));

  const closeModal = ({ refresh = false }) => {
    setModal(false);
    if (refresh) {
      instanceState.update((s) => {
        s.lastUpdate = Date.now();
      });
    }
  };

  return (
    <>
      <Row className="floating-card-header">
        <Col>existing users</Col>
        <Col className="text-right">
          <i
            title="Filter Users"
            className="fa fa-search mr-3"
            onClick={() => setTableState({ ...tableState, filtered: tableState.showFilter ? [] : tableState.filtered, showFilter: !tableState.showFilter })}
          />
        </Col>
      </Row>
      <Card className="my-3">
        <CardBody>
          <ReactTable
            data={users}
            columns={tableColumns}
            onFilteredChange={(value) => setTableState({ ...tableState, filtered: value })}
            filtered={tableState.filtered}
            onSortedChange={(value) => setTableState({ ...tableState, sorted: value })}
            sorted={tableState.sorted}
            page={tableState.page}
            filterable={tableState.showFilter}
            defaultPageSize={tableState.pageSize}
            pageSize={tableState.pageSize}
            onPageSizeChange={(value) => setTableState({ ...tableState, pageSize: value })}
            resizable={false}
          />
        </CardBody>
      </Card>
      {modal?.action === 'password' ? (
        <ModalPassword closeModal={closeModal} username={modal.username} clusterUser={modal.cluster_user} />
      ) : modal?.action === 'role' ? (
        <ModalRole closeModal={closeModal} username={modal.username} role={modal.role} />
      ) : modal?.action === 'delete' ? (
        <ModalDelete closeModal={closeModal} username={modal.username} />
      ) : null}
    </>
  );
};
