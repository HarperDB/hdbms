import React from 'react';
import { Card, CardBody, Col, Row } from '@nio/ui-kit';

import InstanceManagerRow from './manageInstancesRow';

export default ({ items, itemType }) => (
  <div className="entity-manager">
    <div className="text-white floating-card-header">{itemType} instances</div>
    <Card className="mt-3 mb-4">
      <CardBody>
        {items && items.length ? (
          items.map((item) => <InstanceManagerRow key={item.instance_name} item={item} itemType={itemType} />)
        ) : (
          <Row className="item-row">
            <Col className="text-nowrap text-truncate pt-1">There are no {itemType} instances</Col>
          </Row>
        )}
      </CardBody>
    </Card>
  </div>
);
