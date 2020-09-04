import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Input, Form } from 'reactstrap';
import { useHistory } from 'react-router';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';

import addRole from '../../../api/instance/addRole';
import instanceState from '../../../state/instanceState';

export default ({ itemType, toggleDropItem, toggleCreate, baseUrl }) => {
  const { compute_stack_id, customer_id } = useParams();
  const history = useHistory();
  const auth = useStoreState(instanceState, (s) => s.auth);
  const url = useStoreState(instanceState, (s) => s.url);
  const is_local = useStoreState(instanceState, (s) => s.is_local);
  const existing_roles = useStoreState(instanceState, (s) => s.roles && s.roles.map((r) => r.role));

  const [entity, setEntity] = useState({});

  const createItem = async (e) => {
    e.preventDefault();

    if (!entity.name || existing_roles.includes(entity.name)) {
      setEntity({ ...entity, error: true });
      return false;
    }

    const response = await addRole({
      auth,
      url,
      is_local,
      compute_stack_id,
      customer_id,
      role: entity.name,
      permission: {
        cluster_user: itemType === 'cluster user',
        super_user: itemType === 'super user',
      },
    });
    setEntity({});
    instanceState.update((s) => {
      s.lastUpdate = Date.now();
    });
    return setTimeout(() => history.push(`${baseUrl}/${response.id}`), 100);
  };

  useEffect(() => toggleDropItem(), [toggleDropItem]);

  return (
    <Form onSubmit={createItem}>
      <Row className="item-row form">
        <Col className="input-holder">
          <Input
            id="name"
            invalid={entity.error}
            onChange={(e) =>
              setEntity({
                name: e.target.value.toString(),
              })
            }
            type="text"
            name="name"
            placeholder="name"
          />
        </Col>
        <Col className="item-action">
          <Button id="createRole" color="success" className="round mr-1">
            <i className="fa fa-check text-white" />
          </Button>
          <Button color="black" className="round" onClick={() => toggleCreate(false)}>
            <i className="fa fa-times text-white" />
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
