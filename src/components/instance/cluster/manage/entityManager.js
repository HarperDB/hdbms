import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'pullstate';

import InstanceManagerRow from './entityManagerRow';
import instanceState from '../../../../functions/state/instanceState';

const EntityManager = ({ itemType, setShowModal, refreshNetwork, loading }) => {
  const { compute_stack_id } = useParams();
  const items = useStoreState(instanceState, (s) => (s.clustering ? s.clustering[itemType] : []), [compute_stack_id]);

  return (
    <div className="entity-manager">
      <div className="floating-card-header">{itemType} instances</div>
      <Card className="my-3">
        <CardBody>
          {items && items.length ? (
            items.map((item) => (
              <InstanceManagerRow key={item.instance_name} item={item} itemType={itemType} setShowModal={setShowModal} refreshNetwork={refreshNetwork} loading={loading} />
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
};

export default EntityManager;
