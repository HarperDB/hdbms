import React from 'react';
import { Row, Col } from '@nio/ui-kit';

import UpdateInstanceForm from './updateInstanceForm';
import InstanceDetails from './instanceDetails';

export default ({ auth, details, refreshInstance }) => (
  <Row>
    <Col xl="4" lg="5" md="6" xs="12">
      <UpdateInstanceForm
        instanceAuth={auth}
        details={details}
        refreshInstance={refreshInstance}
      />
    </Col>
    <Col xl="8" lg="7" md="6" xs="12" className="pb-5">
      <InstanceDetails
        details={details}
      />
    </Col>
  </Row>
);
