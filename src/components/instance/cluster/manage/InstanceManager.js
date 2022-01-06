import React, { useCallback } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';
import { useAlert } from 'react-alert';

import instanceState from '../../../../functions/state/instanceState';

import InstanceManagerRow from './InstanceManagerRow';

import addNode from '../../../../functions/api/instance/addNode';
import removeNode from '../../../../functions/api/instance/removeNode';

function InstanceManager({ items, itemType, setShowModal, loading, setLoading, refreshNetwork }) {
  const { customer_id } = useParams();
  const alert = useAlert();
  const compute_stack_id = useStoreState(instanceState, (s) => s.compute_stack_id);
  const auth = useStoreState(instanceState, (s) => s.auth, [compute_stack_id]);
  const url = useStoreState(instanceState, (s) => s.url, [compute_stack_id]);
  const is_local = useStoreState(instanceState, (s) => s.is_local, [compute_stack_id]);

  const handleAddNode = useCallback(
    async (payload) => {
      setLoading(payload.compute_stack_id);
      const result = await addNode({ ...payload, auth, url, is_local, customer_id });
      if (result.error) {
        alert.error(payload.instance_host === 'localhost' ? "External instances cannot reach that instance's URL" : result.message);
        setLoading(false);
      } else {
        refreshNetwork();
      }
    },
    [setLoading, auth, url, is_local, customer_id, refreshNetwork, alert]
  );

  const handleRemoveNode = useCallback(
    async (payload) => {
      setLoading(payload.compute_stack_id);
      const result = await removeNode({ ...payload, auth, url, is_local, customer_id });
      if (result.error) {
        alert.error(result.message);
        setLoading(false);
      } else {
        refreshNetwork();
      }
    },
    [setLoading, auth, url, is_local, customer_id, refreshNetwork, alert]
  );

  return (
    <div className="entity-manager">
      <div className="floating-card-header">{itemType} instances</div>
      <Card className="my-3">
        <CardBody>
          {items && items.length ? (
            items.map((item) => (
              <InstanceManagerRow
                key={item.instance_name}
                item={item}
                itemType={itemType}
                setShowModal={setShowModal}
                handleAddNode={handleAddNode}
                handleRemoveNode={handleRemoveNode}
                loading={loading}
                refreshNetwork={refreshNetwork}
              />
            ))
          ) : (
            <Row className="item-row">
              <Col className="item-label">There are no {itemType} instances</Col>
            </Row>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default InstanceManager;
