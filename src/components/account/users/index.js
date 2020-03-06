import React, { useState } from 'react';
import { Row, Col } from '@nio/ui-kit';

import DataTable from './datatable';
import AddUserForm from './add';

export default () => {
  const [lastUpdate, setLastUpdate] = useState(false);

  return (
    <Row>
      <Col xl="3" lg="4" md="5" xs="12">
        <AddUserForm setLastUpdate={setLastUpdate} />
      </Col>
      <Col xl="9" lg="8" md="7" xs="12" className="pb-5">
        <DataTable lastUpdate={lastUpdate} setLastUpdate={setLastUpdate} />
      </Col>
    </Row>
  );
};
