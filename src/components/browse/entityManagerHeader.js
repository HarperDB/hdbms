import React from 'react';
import { Row, Col } from '@nio/ui-kit';

export default ({ items, itemType, toggleDropItem, isDropping, toggleCreate, isCreating }) => (
  <Row>
    <Col className="text-white">
      {itemType}s
    </Col>
    { items && items.length ? (
      <Col className="text-right">
        <i title={`Remove ${itemType}s`} className="fa fa-minus text-white mr-2" onClick={() => { toggleDropItem(!isDropping); toggleCreate(false); }} />
        <i title={`Add ${itemType}`} className="fa fa-plus text-white" onClick={() => { toggleCreate(!isCreating); toggleDropItem(false); }} />
      </Col>
    ) : null}
  </Row>
);
