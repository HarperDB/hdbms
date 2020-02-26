import React, { useState } from 'react';
import { Row, Col } from '@nio/ui-kit';
import useAsyncEffect from 'use-async-effect';

import DataTable from './datatable';
import AddUserForm from './add';
import getUsers from '../../../api/lms/getUsers';
import useLMS from '../../../state/lmsData';
import defaultLMSData from '../../../state/defaults/defaultLMSData';
import customerUserColumns from '../../../util/datatable/customerUserColumns';

export default () => {
  const [{ auth, customer }] = useLMS(defaultLMSData);
  const [lastUpdate, setLastUpdate] = useState(false);
  const [tableData, setTableData] = useState({ data: [], columns: customerUserColumns({ auth, setLastUpdate, customer_id: customer?.id }) });

  useAsyncEffect(async () => {
    const newTableData = await getUsers({ auth });
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
