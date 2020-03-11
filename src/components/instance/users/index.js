import React, { useState, useEffect } from 'react';
import { Row, Col } from '@nio/ui-kit';
import { useAlert } from 'react-alert';

import DataTable from './datatable';
import AddUserForm from './add';

import dropUser from '../../../api/instance/dropUser';
import instanceUserColumns from '../../../util/datatable/instanceUserColumns';

export default ({ auth, url, users, roles, refreshInstance }) => {
  const alert = useAlert();
  const [tableData, setTableData] = useState({ data: [], columns: [] });

  const deleteUser = async ({ username }) => {
    const response = await dropUser({ auth, username, url });

    if (response.message.indexOf('successfully') !== -1) {
      alert.success(response.message);
      setTimeout(() => refreshInstance(Date.now()), 0);
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
    <Row>
      <Col xl="3" lg="4" md="5" xs="12">
        <AddUserForm auth={auth} users={users} url={url} roles={roles} refreshInstance={refreshInstance} />
      </Col>
      <Col xl="9" lg="8" md="7" xs="12" className="pb-5">
        <DataTable tableData={tableData} />
      </Col>
    </Row>
  );
};
