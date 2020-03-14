import React from 'react';
import { Row, Col, Button } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import createClusterUserRole from '../../../api/instance/createClusterUserRole';
import instanceState from '../../../state/stores/instanceState';

export default () => {
  const { auth, url, cluster_role } = useStoreState(instanceState, (s) => ({
    auth: s.auth,
    url: s.url,
    cluster_role: s.network?.cluster_role,
  }));

  return cluster_role ? (
    <Row className="config-row">
      <Col xs="12" md="3" className="text">Cluster Role</Col>
      <Col xs="12" md="6" className="text">{cluster_role}</Col>
      <Col xs="12" md="3" className="text text-right">
        <i className="fa fa-check-circle fa-lg text-success" />
      </Col>
    </Row>
  ) : (
    <Row className="config-row">
      <Col xs="12" md="9" className="text">First, create a Cluster Role</Col>
      <Col xs="12" md="3" className="text-right">
        <Button color="success" block onClick={() => createClusterUserRole({ auth, url })}>Create Cluster Role</Button>
      </Col>
    </Row>
  );
}
