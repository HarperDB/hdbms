import React, { useState } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';

import instanceState from '../../../../functions/state/instanceState';

import addRole from '../../../../functions/api/instance/addRole';

function Role({ refreshStatus, clusterStatus }) {
  const { compute_stack_id, customer_id } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const [loading, setLoading] = useState(false);

  const createClusterUserRole = async () => {
    setLoading(true);
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
      refreshStatus();
      setLoading(false);
    }
  };

  return clusterStatus?.cluster_role ? (
    <Row>
      <Col xs="10" className="text">
        Cluster Role: {clusterStatus?.cluster_role.role}
      </Col>
      <Col xs="2" className="text text-end">
        <i className="fa fa-check-circle fa-lg text-success" />
      </Col>
    </Row>
  ) : (
    <Button color="success" block disabled={loading} onClick={createClusterUserRole}>
      {loading ? <i className="fa fa-spinner fa-spin text-white" /> : 'Create Cluster Role'}
    </Button>
  );
}

export default Role;
