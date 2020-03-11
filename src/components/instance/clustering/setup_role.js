import React from 'react';
import { Row, Col, Button } from '@nio/ui-kit';

import createClusterUserRole from '../../../api/instance/createClusterUserRole';

export default ({ auth, clusterRole, refreshInstance, url }) => (clusterRole ? (
  <Row className="config-row">
    <Col xs="12" md="3" className="text">Cluster Role</Col>
    <Col xs="12" md="6" className="text">{clusterRole}</Col>
    <Col xs="12" md="3" className="text text-right">
      <i className="fa fa-check-circle fa-lg text-success" />
    </Col>
  </Row>
) : (
  <Row className="config-row">
    <Col xs="12" md="9" className="text">First, create a Cluster Role</Col>
    <Col xs="12" md="3" className="text-right">
      <Button color="success" block onClick={() => createClusterUserRole({ auth, refreshInstance, url })}>Create Cluster Role</Button>
    </Col>
  </Row>
));
