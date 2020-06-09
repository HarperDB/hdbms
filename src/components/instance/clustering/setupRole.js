import React from 'react';
import { Row, Col, Button } from '@nio/ui-kit';
import { useStoreState } from 'pullstate';

import createClusterUserRole from '../../../methods/instance/createClusterUserRole';
import instanceState from '../../../state/instanceState';

export default () => {
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const cluster_role = useStoreState(instanceState, (s) => s.network?.cluster_role);

  return cluster_role ? (
    <Row>
      <Col xs="10" className="text">
        Cluster Role
      </Col>
      <Col xs="2" className="text text-right">
        <i className="fa fa-check-circle fa-lg text-success" />
      </Col>
    </Row>
  ) : (
    <>
      <Button color="success" block onClick={() => createClusterUserRole({ auth, url })}>
        Create Cluster Role
      </Button>
    </>
  );
};
