import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';

import instanceState from '../../../../functions/state/instanceState';
import addRole from '../../../../functions/api/instance/addRole';
import buildCustomAPI from '../../../../functions/instance/buildCustomAPI';

const Role = () => {
  const { compute_stack_id, customer_id } = useParams();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const custom_api_role = useStoreState(instanceState, (s) => s.custom_api?.custom_api_role);

  const createCustomAPIUserRole = async () => {
    const response = await addRole({
      auth,
      url,
      role: 'custom_api_user',
      permission: {
        cluster_user: true,
      },
      is_local,
      compute_stack_id,
      customer_id,
    });
    if (!response.error) {
      buildCustomAPI({ auth, url });
    }
  };

  return custom_api_role ? (
    <Row>
      <Col xs="10" className="text">
        Custom API Role
      </Col>
      <Col xs="2" className="text text-right">
        <i className="fa fa-check-circle fa-lg text-success" />
      </Col>
    </Row>
  ) : (
    <Button color="success" block onClick={createCustomAPIUserRole}>
      Create Custom API Role
    </Button>
  );
};

export default Role;
