import React, { useState } from 'react';
import { Row, Col } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import useLMS from '../../../state/stores/lmsAuth';

import DataTable from './datatable';
import AddUserForm from './add';
import getUsers from '../../../api/lms/getUsers';

import defaultLMSAuth from '../../../state/defaults/defaultLMSAuth';
import customerUserColumns from '../../../util/datatable/customerUserColumns';
import useApp from '../../../state/stores/appData';
import defaultAppData from '../../../state/defaults/defaultAppData';

export default () => {
  const [lmsAuth] = useLMS(defaultLMSAuth);
  const [{ customer }] = useApp(defaultAppData);
  const [lastUpdate, setLastUpdate] = useState(false);
  const [tableData, setTableData] = useState({ data: [], columns: customerUserColumns({ auth: lmsAuth, setLastUpdate, customer_id: customer?.id }) });

  useAsyncEffect(async () => {
    const newTableData = await getUsers({ auth: lmsAuth });
    setTableData({ ...tableData, data: newTableData });
  }, [lastUpdate]);

  return (
    <Row>
      <Col xl="3" lg="4" md="5" xs="12">
        <AddUserForm setLastUpdate={setLastUpdate} customerId={customer.id} />
      </Col>
      <Col xl="9" lg="8" md="7" xs="12" className="pb-5">
        <DataTable tableData={tableData} />
      </Col>
    </Row>
  );
};
