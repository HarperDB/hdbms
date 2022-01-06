import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';

import appState from '../../../../functions/state/appState';
import instanceState from '../../../../functions/state/instanceState';
import addRole from '../../../../functions/api/instance/addRole';
import buildNetwork from '../../../../functions/instance/buildNetwork';

function Role() {
  const { compute_stack_id, customer_id } = useParams();
  const instances = useStoreState(appState, (s) => s.instances);
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const cluster_role = useStoreState(instanceState, (s) => s.network?.cluster_role);

  const createClusterUserRole = async () => {
    const response = await addRole({
      auth,
      url,
      role: 'cluster_user',
      permission: {
        cluster_user: true,
      },
      is_local,
      compute_stack_id,
      customer_id,
    });
    if (!response.error) {
      buildNetwork({ auth, url, instances, compute_stack_id });
    }
  };

  return cluster_role ? (
    <Row>
      <Col xs="10" className="text">
        Cluster Role
      </Col>
      <Col xs="2" className="text text-end">
        <i className="fa fa-check-circle fa-lg text-success" />
      </Col>
    </Row>
  ) : (
    <Button color="success" block onClick={createClusterUserRole}>
      Create Cluster Role
    </Button>
  );
}

export default Role;
